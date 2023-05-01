#!/usr/bin/env node

import fs from 'fs';
import { Command } from 'commander';

const program = new Command();

const getJSON = path => {
  const data = fs.readFileSync(path, 'utf8');
  return JSON.parse(data);
};

program
  .command('correct <spec> <services>')
  .description('preserve path prefix for services')
  .action((specFile, servicesList) => {
    const services = servicesList.split(',');
    let spec = getJSON(specFile);

    spec.services.forEach(service => {
      if (services.includes(service.name)) {
        service.routes[0].preserve_path_prefix = true;
      }
    });

    console.log(JSON.stringify(spec, null, 2));
  });

program
  .command('merge-top-level <spec> <replacer>')
  .description('Merge top level properties')
  .action((specFile, replaceFile) => {
    const spec = getJSON(specFile);
    const replacer = getJSON(replaceFile);

    console.log(JSON.stringify({ ...spec, ...replacer }, null, 2));
  });

program
  .command('merge-service <spec> <service-name> <service-spec>')
  .description('Merge service properties')
  .action((specFile, serviceName, serviceSpecFile) => {
    let spec = getJSON(specFile);
    let serviceSpec = getJSON(serviceSpecFile);

    spec.services = spec.services.map(service => {
      return service.name === serviceName
        ? { ...service, ...serviceSpec }
        : service;
    });

    console.log(JSON.stringify(spec, null, 2));
  });

program
  .command('delete-top-level-props <spec> <props>')
  .description('Delete top level properties')
  .action((specFile, propsList) => {
    const props = propsList.split(',');
    let spec = getJSON(specFile);

    props.forEach(prop => {
      delete spec[prop];
    });

    console.log(JSON.stringify(spec, null, 2));
  });

program
  .command('delete-service-props <spec> <service-name> <props>')
  .description('Delete service properties')
  .action((specFile, serviceName, propList) => {
    const props = propList.split(',');
    let spec = getJSON(specFile);

    spec.services = spec.services.map(service => {
      if (service.name === serviceName) {
        props.forEach(prop => {
          delete service[prop];
        });
      }
      return service;
    });

    console.log(JSON.stringify(spec, null, 2));
  });

program
  .command('delete-services <spec> <services>')
  .description('Delete services')
  .action((specFile, serviceList) => {
    const services = serviceList.split(',');
    let spec = getJSON(specFile);

    spec.services = spec.services.filter(service => {
      return !services.includes(service.name);
    });

    if (Array.isArray(spec.ingress.rules)) {
      spec.ingress.rules = spec.ingress.rules.filter(rule => {
        return !services.includes(rule.component.name);
      });
    }

    console.log(JSON.stringify(spec, null, 2));
  });

program.parse(process.argv);
