import rollupResolve from '@rollup/plugin-node-resolve';
import rollupTypescript from '@rollup/plugin-typescript';

const packageJson = require('./package.json');

function getFieldFromPackageJson(fieldName) {
  const entry = packageJson[fieldName];
  if (entry === undefined) {
    throw Error(`Failed to read field "${fieldName}" from package.json.`);
  }

  return entry;
}

const excludeNodeModulesDependencies = (id) => {
  // Do not exclude relative imports.
  if (id.startsWith('./') || id.startsWith('../')) {
    return false;
  }

  if (!require.resolve(id).includes('node_modules')) {
    return false;
  }

  return true;
};

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: getFieldFromPackageJson('module'),
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: excludeNodeModulesDependencies,
    plugins: [rollupResolve(), rollupTypescript()],
  },
];
