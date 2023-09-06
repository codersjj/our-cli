# our-cli

## Usage

```shell
npm install our-cli -g
```

### Create project

```shell
our-cli create your_project_name
```

### Add Component

```shell
our-cli addcpn YourComponentName # default vue component, default destination: src/components
our-cli addcpn YourComponentName -t react # add react component
our-cli addcpn YourComponentName -d src/views # specify destination: src/views
our-cli addcpn YourComponentName -t react -d src/views # add react component, specify destination: src/views
```
