import { Injectable } from "@nestjs/common";
import { Command, Positional } from "nestjs-command";
import { UrlBuilder } from "@innova2/url-builder";
import { CategoriesService } from "./api/category/categories.service";
import { ProductsService } from "./api/product/products.service";

import { request } from "undici";
import * as yup from 'yup';

@Injectable()
export class AppCommand {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Command({
    command: 'db:populate [product-count] [api-url]',
    describe: 'Imports categories and products from Mercado Livre\'s API.',
  })
  async populateDatabase(
    @Positional({
      name: 'product-count',
      coerce: ((n: number) => { // validation
        if (n >= 4) {
          return n;
        } else {
          throw new RangeError(`Error: product-count must be at least 4. Value passed: ${n}.`);
        }
      }),
      describe: 'The number of products to import from each category. (Min: 4)',
      type: 'number',
      default: 4
    })
    productCount: number,
    @Positional({
      name: 'api-url',
      describe: 'The base API URL to fetch data from.',
      type: 'string',
      default: 'https://api.mercadolibre.com/sites/MLB/'
    })
    apiURL: string
  ) {
    if (await this.categoriesService.count() > 0 || await this.productsService.count() > 0) {
      console.error('Error: Cannot import categories and products into a non-empty database.');
      return;
    }

    const url = () => UrlBuilder.createFromUrl(apiURL);

    // root (all categories)
    const categoriesUrl = () => url()
      .addPath('categories')
      .toString();

    // items | query: category=${category}&offset=${offset}&limit=${limit}
    const searchUrl = (categoryId, offset, count) => url()
      .addPath('search')
      .addQuery('category', categoryId)
      .addQuery('offset', offset)
      .addQuery('limit', count) // For simplicity pages are not handled.
      .toString();

    const fetchCategories = async () => {
      const { statusCode, body } = await request(categoriesUrl());

      if (statusCode != 200) {
        throw new Error(`Error requesting categories.\nStatus code: ${statusCode}\nBody: ${body}`);
      }

      const schema = yup.array().of(
        yup.object().shape({
          id: yup.string().required(),
          name: yup.string().required()
        })
      );

      return schema.validate(await body.json());
    };

    const fetchProducts = async (categoryId, offset, count) => {
      const { statusCode, body } = await request(searchUrl(categoryId, offset, count));

      if (statusCode != 200) {
        throw new Error(`Error requesting products.\nStatus code: ${statusCode}\nBody: ${body}`);
      }

      // The price field seems inaccurate for products on sale.
      // But for simplicity I'll use it regardless, instead of parsing the prices array to account for promotions.

      const schema = yup.object().shape({
        results: yup.array().of(
          yup.object().shape({
            id: yup.string().required(),
            title: yup.string().required(),
            // Workaround: https://github.com/jquense/yup/issues/1330 (Allowing yup.number() to accept NaN)
            price: yup.number().transform(value => isNaN(value) ? undefined : value).nullable(),
            available_quantity: yup.number().required()
          })
        )
      });

      const data = await schema.validate(await body.json());

      return data.results;
    };

    try {
      console.log(`Loading ${productCount} products from each category in ${categoriesUrl()}...`);

      let progressCounter = 0;
      const categories = await fetchCategories();

      for (const category of categories) {
        console.log(`Loading products from '${category.name}'...`);

        // Workaround: Request a longer list of items and slice the array to accommodate for gaps in the API results.
        const limitModifier = 5;
        let products = await fetchProducts(category.id, 0, productCount * limitModifier);

        if (products.length >= productCount) {
          products = products.slice(0, productCount);
        } else {
          console.warn(`Warning: Received less than ${productCount} products for category '${category.name}'.`);
        }

        // Assuming the API is consistent it is safe to start saving categories and products from now on.
        const { id: categoryId } = await this.categoriesService.create(category);

        await this.productsService.createMany(categoryId, products);

        ++progressCounter;

        console.log(`Progress: ${progressCounter} out of ${categories.length} (${progressCounter / categories.length * 100}%).`);
      }

      console.log('Done.');
    } catch (error) {
      console.error(`Error while importing products and categories, aborting.\nError: ${error}`);
    }
  }
}
