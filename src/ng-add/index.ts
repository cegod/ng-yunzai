import {Schema} from './schema';
import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext, template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {getProjectFromWorkspace} from '@angular/cdk/schematics';
import {getWorkspace} from '@schematics/angular/utility/config';

export default function (_options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      // 安装依赖
      addPackageToPackageJson(_tree, _context),
      // 删除
      removeOrginalFiles(_options),
      // 创建
      addFiles(_tree, _context, _options)
    ]);
  };
}


export function addPackageToPackageJson(_tree: Tree, _context: SchematicContext): Rule {
  return (host: Tree) => {
    const packageList = [
      'ng-zorro-antd',
      'yunzai',
      '@stomp/ng2-stompjs',
      'sonarqube-scanner',
      'lodash',
      '@types/lodash',
      'conventional-changelog-cli',
      'validate-commit-msg',
      'husky'
    ];
    if (host.exists('package.json')) {
      // @ts-ignore
      const sourceText = host.read('package.json').toString('utf-8');
      const json = JSON.parse(sourceText);
      if (!json.dependencies) {
        json.dependencies = {};
      }
      for (let pkg of packageList) {
        if (!json.dependencies[pkg]) {
          json.dependencies[pkg] = '';
        }
      }
      host.overwrite('package.json', JSON.stringify(json, null, 2));
    }
    _context.addTask(new NodePackageInstallTask());
    return host;
  };
}

function removeOrginalFiles(options: Schema) {
  return (host: Tree) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);
    [
      `${project.sourceRoot}/environments/environment.prod.ts`,
      `${project.sourceRoot}/environments/environment.ts`,
      `${project.sourceRoot}/index.html`,
      `${project.sourceRoot}/app/app.module.ts`,
      `${project.sourceRoot}/app/app.component.ts`,
      `${project.sourceRoot}/app/app.component.html`,
      `${project.sourceRoot}/app/app.component.less`,
      `${project.sourceRoot}/app/app.component.css`,
      `${project.sourceRoot}/app/app-routing.module.ts`,
    ]
      .filter(p => host.exists(p))
      .forEach(p => host.delete(p));
    return host;
  };
}

function addFiles(_tree: Tree, _context: SchematicContext, options: Schema) {
  const workspace = getWorkspace(_tree);
  const project = getProjectFromWorkspace(workspace, options.project);
  return chain([
      mergeWith(
        apply(url('./files/src'), [
          template({
            ...options,
          }),
          move(project.sourceRoot as string),
        ]),
        MergeStrategy.Overwrite
      ),
    ]
  );
}

