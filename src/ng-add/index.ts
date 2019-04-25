import {Schema} from './schema';
import {
    apply,
    chain,
    MergeStrategy,
    mergeWith,
    move,
    Rule,
    SchematicContext,
    template,
    Tree,
    url,
} from '@angular-devkit/schematics';
import {getProjectFromWorkspace} from '@angular/cdk/schematics';
import {getWorkspace} from '@schematics/angular/utility/config';
import {addPackageJsonDependency, NodeDependency, NodeDependencyType} from "@schematics/angular/utility/dependencies";
import {NodePackageInstallTask} from "@angular-devkit/schematics/tasks";

const dependencies: NodeDependency[] = [
    {type: NodeDependencyType.Default, version: '1.1.20-alpha', name: 'yunzai'},
    {type: NodeDependencyType.Default, version: '^4.14.123', name: 'lodash'},
    {type: NodeDependencyType.Default, version: '^4.14.123', name: '@types/lodash'},
    {type: NodeDependencyType.Default, version: '^7.2.0', name: '@stomp/ng2-stompjs'},
    {type: NodeDependencyType.Dev, version: '^1.3.1', name: 'husky'},
    {type: NodeDependencyType.Dev, version: '^2.14.0', name: 'validate-commit-msg'},
    {type: NodeDependencyType.Dev, version: '^2.0.12', name: 'conventional-changelog-cli'},
    {type: NodeDependencyType.Dev, version: '^2.4.0', name: 'sonarqube-scanner'},

]


export default function (_options: Schema): Rule {
    return (_tree: Tree, _context: SchematicContext) => {
        return chain([
            // 生成依赖
            generatePackageToPackageJson(_context),
            // 生成scripts sonar hooks
            generateScriptsSonarHooks(_context),
            // 删除
            removeOrginalFiles(_options),
            // 创建
            addFiles(_tree, _context, _options),
            // 下载所有包
            downLoadAllPackages(_context),
        ]);
    };
}


export function generatePackageToPackageJson(_context: SchematicContext): Rule {
    return (host: Tree) => {
        dependencies.forEach(dependency => {
            addPackageJsonDependency(host, dependency);
            _context.logger.log('info', `️Added "${dependency.name}" into ${dependency.type}`);
        });
        return host;
    };
}


export function generateScriptsSonarHooks(_context: SchematicContext): Rule {
    return (host: Tree) => {
        if (host.exists('package.json')) {
            // @ts-ignore
            const sourceText = host.read('package.json').toString('utf-8');
            const json = JSON.parse(sourceText);
            if (!json.scripts) {
                json.scripts = {}
            } else {
                json.scripts.lint = "ng lint";
                json.scripts.fixcode = "npm run lint --fix";
                json.scripts.version = "./node_modules/.bin/conventional-changelog -p angular -i CHANGELOG.md -s --pkg package.json";
                json.scripts.scanner = "npm run fixcode && ./node_modules/.bin/sonar-scanner"
            }
            if (!json.husky) {
                json.husky = {hooks: {}}
            }
            json.husky.hooks['pre-commit'] = "npm run lint";
            json.husky.hooks['commit-msg'] = "validate-commit-msg";
            host.overwrite('package.json', JSON.stringify(json, null, 2));
        }
        return host;
    };
}

export function downLoadAllPackages(_context: SchematicContext): Rule {
    return (host: Tree) => {
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
            `${project.sourceRoot}/assets/logo/applicationLogo.png`,
            `${project.sourceRoot}/assets/logo/maxLogo.png`,
            `${project.sourceRoot}/assets/logo/miniLogo.png`,
            `${project.sourceRoot}/assets/user_man_icon.png`,
            `${project.sourceRoot}/index.html`,
            `${project.sourceRoot}/app/app.module.ts`,
            `${project.sourceRoot}/app/app.component.ts`,
            `${project.sourceRoot}/app/app.component.html`,
            `${project.sourceRoot}/app/app.component.less`,
            `${project.sourceRoot}/app/demo/demo.component.html`,
            `${project.sourceRoot}/app/demo/demo.component.less`,
            `${project.sourceRoot}/app/demo/demo.component.ts`,
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
                apply(url('./files'), [
                    template({
                        ...options,
                    }),
                    move(project.root as string),
                ]),
                MergeStrategy.Overwrite
            )
        ]
    );
}

