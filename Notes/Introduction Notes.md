# INTRO TO NEXT

React came in 2015

JS came in 1995 by Brandon Icke of Netscape.

Why these modern frameworks like REACT and Angular make web development easy?

A. 

1. Architecture - React and Angular follow a component based architecture. This encourages code re-usability.

This reusability enhances the maintainability and scalability of the application.

2. Virtual DOM - Virtual DOM is a lightweight representation of the real DOM. It gives optimized and efficient updates to the user interface. This improves the performance of the app.

It tracks changes in the app and performs a diffing process (i.e. comparing current dom version to the previous dom version and incorporating those changes).

3. Ecosystem and community

These new frameworks gives the developers:

- Abundent resources
- Extensive Documentation
- Reusable Code Packages
- Bug Fixes
- Support

 Guillermo Rouch made Next.js and Socket.io in 2016

 Some features of Next.js:

 - File Based Routing
 - Automatic Code Splitting
 - Hybrid Rendering
 - Internationalization
 - Image and Font Optimization
 - HMR (Hot module Replacement)  
 - Built in support for Sass
 - CSS Modules
 - Data fetching choice
 - Error Handling
 - Metadata API (for SEO)
 etc.

 What is a framework?

 In software development, a framework serves as a tool equipped with a predefined rules and conventions that offer a structured approach to constructing an application.

 It provides an environment that outlines the :

 - Overall architecture
 - Design Patterns
 - Workflows

 This makes the developer focus more on logic than in low level design.

 In leyman's terms, a framework provides pre-built solutions for common functionalities such as:

 - Integrating Databases
 - Managing Routing
 - Handling Authentication etc.

  Next.js is built on top of react.js.

Why use frameworks like NEXT

- They take less tooling time

Every aspect of frontend innovation has seen innovations in: 

- Compiling 
- Bundling
- Mintifying
- Formatting
- Deploying
etc.

In NEXT, we donot have to worry about configuring these tools, rather we can invest more time in writing react code.

We can focus more in business logic of routing, data fetching, rendering, authentication etc.

Next js is a full stack framework.

Next js has built-in features like:

- Server side rendering
- Static site generation
- Automatic code splitting
etc.

This gives us the following benefits:
- Optimize application performance
- Enable faster initial page load times
- Improve SEO
- Enhance the user experience

Next js automates many aspects allowing us to focus more on utilizing the features rather than dealing with infrastructure and boiler plate code.

This approach follows the principle of convention over configuration.

SSR (Server Side Rendering) and SSG (Static Site Generation) in NEXT helps in improving SEO of our apps.

In Normal cases the site sends a small html file and a large JS file as response when SEO client requests the site. This results in poor SEO.

In Next, the client gets a large HTML file and a small JS file, this makes it easier for the SEO crawlers to go through the contents of our app and read it, thus improving its SEO.


## How Web Works?

1. Traditional Vanilla Approach

Here we have HTML, CSS and JS as code files which make up the web site.

For a single page web site:
First the client request for the site, then as response the HTML file is sent to them, after that the CSS file styling is applied to it and finally JS file adds functionality to it.

Most of the processing and rendering is done by the web browser on the client side.

For multiple web pages website:
Client makes request for each page to the server and in response each page follows the same process as that followed by a single web page, one after the other.

Bandwidth -> As the number of pages in the website increases and the website starts to get more complex, the bandwidth of it starts to increase.

2. React Approach

React introduced components, virtual dom and client and server mechanism.

When the client visits a react site and requests for the website, the server sends a minimal html file, and a JS bundle file.

React initialtes the client side rendering using this JS bundler file, and manipulates the virtual DOM.

React does not modify the real DOM but only updates the necessary change in the virtual DOM and then compares it with the real dom.

React uses its own client side routing library called react router, which is used to navigate to different locations within the react app.

This library helps us to change the route without a full server request. This prevents the page refreshes.

If a new route is triggered, it renders and re-renders the necessary components needed for that page.

If any component is fetching data from the server, it makes a request to the server.

Here using react, complexity increases as compared to vanilla approach.

Also client side rendering + using JS to render files does not help to increase SEO.

3. Next JS approach

Here while using NEXT JS we can choose whether to render the components on the client side, or on the server side.

When a user visits a NEXT site and the client makes a request, the client sends a request to the server, which starts executing the react components, generates the HTML, CSS, and JS files and sends a fully rendered HTML file back to the client as a response.

This HTML file contains:
- Initial Content
- Fetched Data
- React Component Markup.

making the client render it immediately without waiting for the Javascript to download and execute. 

Though it does not mean we donot need any JS file, the server sends back the JS file as needed for user interaction.

From here Next js takes over and performs client side hydration.

### Hydration and Hydration Error:

Hydration is attaching Javascript event handlers and interactivity to the pre-rendered HTML.

And when the placeholders of the react components eg: div, form, span donot match with what is being rendered on the client side, we get the hydration error.