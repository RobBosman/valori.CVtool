# CVtool

# React + Redux + vert.x Application

see also
* https://reactjs.org/docs/getting-started.html
* https://gist.github.com/eirikb/06f92fd3857063b58512

Visual Studio Code with plugins
* Beautify
* ESLint
* Git History
* Markdown All in One
* Babel JavaScript

## TODO:
* setup data model (hierarchy, Json data structure)
* map to 'normalized Json' (list of entities and instances)
* deal with lists of model elements in UI
* extend UI with all required pivots and fields for maintaining cv
* store model in MongoDB
* request Valori server (docker) and database
* store model in other database
* convert data from old database (directly connect to old database?)
* add OpenID Connect authentication flow
  (client obtains code; server obtains token)
* add auto-refresh of tokens (how? hidden iframe?)
* secure vert.x event bus
* add Word export
* add storing in SharePoint
* add auto-save
* add admin role and functionality

## DONE:
* dive into web components and React
* explore npm, node and webpack
* combine npm, node with maven
* apply Redux (with epics)
* apply Fabric UI
* explore Fabric theming (css via javascript)
* switch to React functions and hooks (instead of components)
* connect vert.x EventBus in React (plus fine tuning for resilience)