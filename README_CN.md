# EN_US

# What this

The Angular cli to help bbyz programers create project quickly

# How to use

the generated project depend on ng-zorro-antd so the first one  
install ng-zorro-antd please

```
ng new project --style=less
```

```
cd project 
ng add ng-zorro-antd
ng add yunzai@latest
```

# Run

## config

1.config your stomp server's address in sharedModule  
2.config your service server's address in environments  

## run

```
ng serve
```

# Others

## sonar-scan

config your sonar server's address in sonar-scanner.properties  
and run the script

```
yarn scanner
```

it will push to the serve automaticly



## commit

pre commit the git hook will run `ng lint` to check your code  
if lint error you will not push the code.

Everything is automatic.

# Changelog

## git work flow

https://www.cnblogs.com/jiuyi/p/7690615.html

## generate log

if you followed the GitWorkFlow the you can use `yarn version` 
to up the version of project.the command can trigger the script to
generate Changelog

Everything is automatic.
