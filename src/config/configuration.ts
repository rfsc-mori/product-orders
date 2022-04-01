import { join } from 'path';
import { readFileSync } from "fs";
import * as yaml from 'js-yaml';
import * as yup from 'yup';

const YAML_CONFIG_FILENAME = 'config.yaml';

export default () => {
  const fileName = join(__dirname, YAML_CONFIG_FILENAME);
  const data = readFileSync(fileName, 'utf8');

  const values = yaml.load(data) as Record<string, any>;

  const schema = yup.object({
    app: yup.object({
      port: yup.number().required()
    })
  });

  return schema.validate(values, { abortEarly: false });
};
