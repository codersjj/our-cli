# my-cli

## Usage

```shell
npm install my-cli -g
```

### Create project

```shell
my-cli create your_project_name
```

### Add Component

```shell
my-cli addcpn YourComponentName # default vue component, default destination: src/components
my-cli addcpn YourComponentName -t react # add react component
my-cli addcpn YourComponentName -d src/views # specify destination: src/views
my-cli addcpn YourComponentName -t react -d src/views # add react component, specify destination: src/views
```
