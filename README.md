# Virtualization of nested lists on React

Project is based on create-react-app and has usual commands: 
* `yarn start` for running main page (you can click here, everything is settled)
* `yarn test` for running tests (we have them, hooray!)
* `yarn build` for building app, of course
* `yarn eject` for exciting evening
* `yarn storybook` if you want to poke some props 

## What's inside

There are two components - CustomTree и NativeTree, which implement logic of viewing list of nested object. Both of them offer functionality for styling parent and child elements, and also child elements themselves (in case if there is no necessity to pass your own components to render functions) ready to be styled via CSS.

### CustomTree

Component, which as accurately as possible implements idea of virtualization by rendering on page only those items which are enough for displaying on several screens. On scroll down or up it "loads" missing items. It "remembers" state for nested elements.
Depending on the user's intentions it also can be switched to "forced" mode to show all items.

### NativeTree

Component, which implements "perfect" accessibility-friendly markup, assuming use of appropriate html tags and their native browser behavior. Shows all given items. 

## Points of growth
* ~~add storybook~~
* ~~rewrite everuthing in english~~
* ~~use bigger offsets~~
* ~~add sorting by "expandable" status~~
* think about moving common logic out of components (it will decrease readability, but increase supportability)
* think about minimisation or rerenders (React.memo for obvious reasons does not work for children lists)
* handle list items with custom height
* add more detailed tests for preloading on scrolling (IntersectionObserver mock is not that flexible for it)
* reorganize as separate library with exportable components
* add more stability on extremely fast scrolling

### How it was made
[Here](https://medium.com/@mei33.pw/list-virtualization-on-react-bc583db6951f) you can read about my intentions and whole process. Feel free to discuss.
