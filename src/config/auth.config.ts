import { registerAs } from "@nestjs/config";
import { readFileSync } from "fs";
import { join } from 'path';
import * as yaml from 'js-yaml';
import * as yup from "yup";

const YAML_AUTH_CONFIG_FILENAME = 'auth.config.yaml';

export default registerAs('auth', () => {
  const fileName = join(__dirname, YAML_AUTH_CONFIG_FILENAME);
  const data = readFileSync(fileName, 'utf8');

  const values = yaml.load(data) as Record<string, any>;

  const schema = yup.object({
    jwt: yup.object({
      secret: yup.string().required(),
      expires: yup.string().required()
    })
  });

  return schema.validate(values, { abortEarly: false });
});
