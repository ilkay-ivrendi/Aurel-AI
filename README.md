# Aurel-AI Private Virtual Assitant

<p align="center">
  <img width="460" height="460" src="./assets/images/aurel-ai.png">
</p>


<p align="center">
    <img src="https://skillicons.dev/icons?i=nodejs,angular,nest,threejs,docker,mongodb,ts,html,scss" />
</p>


## Start the app

To start the development server run `nx serve aurel-ai`. Open your browser and navigate to http://localhost:4200/. Happy coding!


## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/features/generate-code).

## Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

# Helpful Codes

## Generate UI lib
````
nx g @nx/angular:lib  libs/ui
````


## Add a component

To create example component:


```
nx g @nx/angular:component libs/ui/src/lib/button
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Want better Editor Integration?

Have a look at the [Nx Console extensions](https://nx.dev/nx-console). It provides autocomplete support, a UI for exploring and running tasks & generators, and more! Available for VSCode, IntelliJ and comes with a LSP for Vim users.

## Ready to deploy?

Just run `nx build demoapp` to build the application. The build artifacts will be stored in the `dist/` directory, ready to be deployed.