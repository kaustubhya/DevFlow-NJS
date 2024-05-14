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

### Routing in Next JS

In NEXT, we have file based routing. This means that to make a route we have to create a folder (say about (🛑 all lower case, this is mandatory)) and inside it we make a file page.js or .jsx or .tsx (whichever you like).

This way we can make routes. Also in addition we can include a ui file having css code to style the routes.

In react, we used to make routes and nested routes using createBrowserRouter and route, routes, links from react router dom and we used to update it by importing the route in every page.

If you want to import a navbar component, either you can import it in each page (like we did in react) or import it in the parent component of these routes i.e. use layout.tsx to import it in every page (this is a better option).

This however gets very complicated in larger websites which have a lot of pages with nested routes. Next solves this problem by simply adding routes to the parent element i.e. app folder (keep in mind that next is a framework so rules are very strict.)

For nested routes make nested folders.

eg.

- about folder
  - projects folder
  - page.tsx (of project)
- page.tsx (of about. Include a link here which can take us to projects page i.e. /about/projects. Also a normal content for about page.)

Dynamic Routes - This is same as nested routes but here the name of the route and its data is not fixed. It can change.

🛑 To create a dynamic route, we wrap the folder's name in square brackets. This symbolizes that it is of the same name as the name of the folder and the content inside the square bracket is a variable.

eg.

- projects (main folder)
  - [slug1 say volcano project]
    - page.tsx
  - [slug2 say doctor project]
    - page.tsx
  - [slug3 say car project]
    - page.tsx
- page.tsx (here we include a ul of links for dynamic routes and their styling files)

But all these won't change the title name according to the folder(route here) name.
To do so, use {params} and in the content, use {params.name}. This will show title of the dynamic route name and not a fixed text title.

#### Route Groups

In next js' file based routing system, there are many folders and files inside the app folder as routes. These can sometimes become a little bit intimidating and scary.

To reduce this hotch-potch, we have route groups in next js.

🛑 To include folders in route groups, we enclose the folder name in parenthesis (). Inside that we can do as we want.

eg.

- app
  - auth
    - sign-in
      • page.tsx
    - sign-out
      • page.tsx

Now for sign in page, the route is auth/sign-in but say we donot want /auth to be with sign-in (we want only /sign-in). For this we use route-groups.

- app

  - (auth)

    - sign-in
      • page.tsx
    - sign-out
      • page.ts

  - (dashboard)
    - home
      • page.tsx
    - about
      • page.tsx
    - contact-us
      • page.tsx

Now we have 2 different route groups, one having routes for auth and another having routes for dashboard.

## Routing Qs:

### Q1. Explain how Next.js routing differ from react.js routing?

### Q2. What is the purpose of route groups and how can they be created in next.js?

In the app directory, nested folders are normally mapped to URL paths. However, you can mark a folder as a Route Group to prevent the folder from being included in the route's URL path.

This allows you to organize your route segments and project files into logical groups without affecting the URL path structure.

Route groups are useful for:

Organizing routes into groups e.g. by site section, intent, or team.
Enabling nested layouts in the same route segment level:
Creating multiple nested layouts in the same segment, including multiple root layouts
Adding a layout to a subset of routes in a common segment
Convention
A route group can be created by wrapping a folder's name in parenthesis: (folderName)

### Q3. What is a dynamic route and why should we create dynamic routes in web applications?

# 🛑 011_Routing:

DevFlow Routing:

Here just create a new branch 011_routing and then publish it.

make an (auth) route group

then insert 2 route folders => sign-in and sign-up.

Also make a layout.tsx folder in (auth) for both of them.

We are doing this as we want a navbar and footer in all pages, except for a login ui page.

Create page.tsx for both sign-up and sign-in and then do rafce in both.

🛑 After running them, we get a run-time error. This is because, we need to mandatorily export a child from layout.tsx in (auth).

Other routes apart from (auth) will be in (root).

Inside we make (home) and put a page.tsx there. This will replace the default page.tsx of next js hence we will delete the default page.tsx.

# Client vs Server Paradigm

Next js is a mix of both client side and server side.

Clients are usually the devices that we're using like smartphone or computer.

The device sends requests to the server and displays the interface that we can interact with.

The server is just a computer but it is equipped with a strong configuration and remains operational continously. It is the place where all the code for the application is stored.

In earlier versions of next, the server side rendering was only limited to individual pages.

This led to challenges such as prop drilling and duplication of API calls when passing data to lower components.

[READ THIS BLOG:](https://vercel.com/blog/nextjs-app-router-data-fetching)

The NEXT JS 13 App Router brought component level server side rendering.

Using this we can choose to render a component at client side or server side.

This gives us client side and server side components.

Both are react components.

Client side component is rendered at client side in our mobile and computer browsers.

Server side component is rendered at server side where our application is deployed.

Benefits of using Server Components:

1. Small size of JS bundler file: Rendering small components on server side gives us HTML files and thus reduces the burden of the JS bundle files.

These HTML files load a lot quicker than normal JS bundle files (when using react way). This loads our website a lot faster than react sites.

2. Enhanced SEO

3. Faster initial page loading

4. Efficient use of server resources.

## Q. When to decide what to render where?

It depends on what the component does.

If the component needs the user to interact with it like clicking buttons, giving user inputs, triggering events, and using react hooks; use a client component.

If the components does not need any user interactions and needs fetching data from the server, displaying static content, performing server side computations; use a server component.

### In next JS 13's App directory, all components are considered server components by default.

To treat a component as a client component, just put "use client" on the top of the file.

## Next JS does "static rendering" i.e, it pre-renders the necessary content on the server, before sending it to clients.

This pre-rendering process includes server and client components.

USE CLIENT serves as a boundary between client and server components.

## Do not include server components inside the client components.

## Q. What are the different types of components in next.js and explain their differences?

## Q. What are the benefits of server side rendering?

## Q. What are the latest features of the app directory regarding the client / server rendering?

# Rendering: It is a process of creating the user interface from the code we write.

If the page needs the user to interact with it like clicking buttons, giving user inputs, triggering events, and using react hooks; use client side rendering.

If the page does not need any user interactions and needs fetching data from the server, displaying static content, performing server side computations; use server side rendering.

The time: Once the compilation process is complete, which involves converting the code from a higher level programming language to a lower level representation (binary code), our application goes through two crucial phases: Build Time and Run Time.

Build time is where we compile our code.

Run time is when we are running our code.

Run time environment (RTE) is different from run time.

RTE is an environment in which the program or application runs during its execution. It supports a set of libraries, services and run time components that supports the execution of the program.

Node JS is a JavaScript run time environment.

NEXT gives us these 2 runtime environments:

1. Node.js run time - Default Node JS run time that has access to all the Node.js APIs and the ecosystem.

2. Edge run time - A lightweight run time based on web APIs with support to a limited number of NODE JS APIs.

## Use this command to switch your runtime in NEXT

`export const runtime = 'nodejs' (or 'edge')`
Node JS is the default runtime.

## Rendering Strategies provided by NEXT.js for rendering on the server:

1. Static Site Generation
2. Incremental Static Generation
3. Server Side Rendering

### Static Site Generation (SSG)

This happens at build time on the server.

In SSG, during the build time, the content is generated and converted into HTML, CSS and JS files. It does not require server interaction during run time. The generated static files can be hosted on content delivery network (CDN) and then served to the clients as it is.

The result is, the rendered content is cached and re-used on subsequent requests leading to fast content delivery and less server load. This minimal processing results in higher performance.

Although the SSG handles dynamic data during the build process, it requires a re-build if you update anything, as it happens during the build time.

Eg. Blog or News websites, all articles and content are 80% static, if we want to update any article, we re-build it.

### Incremental Static Generation (ISG)

It allows us to update these static pages after we build them, without needing to re-build the entire site.

The on-demand generation of ISR allows us to generate a specific page on-demand or in response to a user's request. Meaning a certain part of the websites or pages will be rendered at build time while the other is generated only when needed, i.e., at run time.

This reduces the build time, and improves the overall performance of the website by updating only requested pages for re-generation.

With this hybrid strategy, we now have the flexibility to manage content updates. We can cache the static content as well as re-validate them if needed.

An example use case would be the same where we can use SSG for the article details page and use ISG for showing the list of articles.

### Server Side Rendering (SSR)

Dynamic Rendering in a nutshell. Enables the generation of dynamic content for each request, providing fresh and interactive experiences.

#### If we have SSG and ISG why do we need SSR

Both SSG and ISG are good, but it is needed where specific use cases are needed.

SSR excels in situations where a website heavily relies on client side interactivity and requires real time updates. It is particularly well-suited for authentication, real time collaborative applications such as chat platforms, editing tools, and video streaming services.

SSR involves heavy server side processing, where the server executes code for each individual request, generates the necessary HTML, and delivers the response along with the required JavaScript code for client side interactivity.

Limitations- Due to its dynamic nature, caching content responses becomes more challenging, which results in increased server load when compared to SSG or ISG.

However the benefits of real time interactivity and up-to-date content makes SSR a valuable choice for specific application requirements.

🛑 By default NEXT uses SSG rendering.

We can easily switch to ISG or SSR in different pages in our NEXT app.

🛑 When to use SSG - When a page or content displays the same information on each request.

🛑 When to use ISG - When a page or content requires frequent information updates, potentially every second.

## Q. What does rendering mean? Explain the different rendering strategies in NEXT.js?

## Q. What is build time and run time. Explain the difference between them in a Web Application life.

We have build / compile time where we prepare our application code for production and it involves the steps like code compilation, bundling, optimization etc.

In short build time is where we compile our code.

`npm run dev` is that command where we build our app which has all the static files, bundling optimization, dependency resolution etc.

Run time is that time where our compiled or deployed application is actively executing and running, involving the dynamic execution of the application's code and the utilization of the system's resources.

In short run time is the time when the user is running our code.

It is about handling user interaction like user input, responding to events and data processing (like manipulating or accessing data) and interacting with external services or APIs.

## Q. What are the benefits of rendering content in a client vs server environment?

Rendering content in a client:

- Rendering Process: Occurs on a user's browser.

- Interactivity and Load time: Provides a dynamic and interactive user experience.

- Fetching and SEO: Smoother transition between the pages and real time data fetching.

- Load and Performance: Reduced server load and potentially lower hosting costs as the client's browser is responsible for handling the rendering.

- Consistent Rendering: Compatibility and performance depend on the user's device configuration.

- Security: Potential risk of security vulnerabilities such as cross site scripting (XSS), Code Injection, Data Exposure etc.

Rendering content in a server:

- Rendering Process - Happens on the server before we send the page to the client's browser.

- Interactivity and Load time: Provides a fully rendered HTML page to the client resulting in faster initial page load time.

- Fetching and SEO: Fully rendered content enhancing the search engine rankings and social media sharing previews.

- Load and Performance: Performs well on any slower device as rendering is done on the server.

- Consistent Rendering: Consistent rendering across any devices regardless of the configuration reducing the risk of compatibility issues.

- Security: Reduces the amount of client side JavaScript code sent to the user's browser thus enhancing security by limiting the potential vulnerabilities.

## Q. Imagine you are developing a large scale e-commerce platform that requires a rendering strategy to handle a high volume of product listings. The platform needs to display product information, pricing, availability, and customer reviews. Additionally, the platform aims to provide a fast and interctive user experience. Considering the complex requirements of the e-commerce platform, discuss the trade-offs and factors you would consider when choosing between Static Site Generation (SSG) and Server Side Rendering (SSR) as the primary rendering strategy.

# Auth

There are many libraries and packages for auth like, Passport, or OAuth, or NextAuth, or Clerk

### We will use Clerk here

"Clerk" works wonderfully with Next13 and SSR.

Make an account in clerk => name your folder => Choose Sign in options => Choose Next JS => And follow the steps given there

(https://dashboard.clerk.com/apps/app_2fuoef1uS4fZEDVK9USFnCGjpqH/instances/ins_2fuoenGClYURgeVfzzcNmHpoal5)

Steps:

1. Install @clerk/nextjs
2. Set your environment variables
3. Update middleware.ts (🛑 this steps solves the problem of showing and hiding specific files. Earlier we used to ask every time whether the user is logged in or not. If yes then go ahead and if not then redirect the user. Here we can do the re-directions directly with the help of clerk, we just need to create a middleware file. Make it in the /root folder).
4. Add ClerkProvider and components to your app (go to app/layout.tsx and paste the code)
5. Create a home page

Making Custom Sign-up and Sign-in pages:

1. Building a sign-up page:
   Follow this special folder structure.

app/sign-up/[[...sign-up]]/page.tsx

(Move the original page.tsx inside the sign-up folder to this new folder)

2. Building a sign-in page:
   Follow this special folder structure.

app/sign-in/[[...sign-in]]/page.tsx
(Move the original page.tsx inside the sign-in folder to this new folder)

3. Update your environment variables (in .env.local)

4. Do `npm run dev` to test it.

## Using React Context for State Management with Next.js

In next js we try to keep everything, server rendered. We can use context only when we use hooks, but hooks by default are client side which eliminates the possibility of things to be server rendered.

[DOCS](https://vercel.com/guides/react-context-state-management-nextjs)

Context is a feature of React, a popular JavaScript library for building user interfaces, that enables components to share data without passing props down manually at every level of the component tree. This is particularly useful for data that can be considered "global" for a tree of React components, such as user authentication status or theme preferences.

Keep in mind that context providers are typically rendered near the root of an application to share global concerns. However, creating a context at the root of your application in Next.js will cause an error in server components. Let's see how to handle this.

### Rendering Third-Party Context Providers in Server Components

In Next.js, React Server Components don't support creating or consuming context directly. If you try to create a context in a Server Component, it will result in an error. Similarly, rendering a third-party context provider that doesn't have the "use client" directive will also cause an error in Server Components.

Instead, you can create your own Client Component that wraps the third-party provider.

By rendering the providers at the root level, all the components throughout your app will be able to consume the context provided by the third-party libraries.

It's worth noting that you should render providers as deep as possible in the component tree.

We already did something like this in layout.tsx. We wrapped our body and children with clerk provider which allowed us to use clerk provider in our entire next js app.

Steps:

1. Create a Context
2. Provide a value to that context using Provider.

🛑🛑 ERROR: createContext in a Server Component
Why This Error Occurred
You are using createContext in a Server Component but it only works in Client Components.

Possible Ways to Fix It
Mark the component using createContext as a Client Component by adding 'use client' at the top of the file.

If we use 'use client' and wrap it, will our code become client side? 🛑Not at all!!

Let us create a context for switching theme between light and dark mode, for that, go to context > ThemeProvider.tsx

🛑🛑🛑 NAVBAR

Now for a navbar, we want it in the root route group and not in the auth route group as we do not want the navbar in signin and signup pages. Hence we create a new layout.tsx for navbar inside (root)

Now in components folder, we have a shared folder, this will store components which will appear on all pages like navbar.

Import it then in the layout.tsx of (root).

🛑🛑 [Installing ShadCn Ui:](https://ui.shadcn.com/docs/installation/next)

WE have installed Button and a menubar from ShadCN.

Now working on Theme.tsx in components > shared > navbar

Now to work over things like light, dark and system mode in theme change menu, we will loop through the items in this menu.

Now to avoid working and writing that piece of code again and again, we can create a constants folder and write our code (code which we will use time and again) there.

Now we will work on the navbar in mobile mode which will look a bit different with a hamburger menu.

🛑🛑 For this: Create a page MobileNav.tsx inside components > shared > navbar

To make this mobile nav, we will use a "SHEET" from ShadCN.

It is a slider menu which appears from the side when we click on the hamburger icon.

[SHEETS](https://ui.shadcn.com/docs/components/sheet)

After working on MobileNav, we are working on NavContent function. This will allow us to make the buttons and links to different pages in the Mobile Navbar (which slides in from the left via sheets).

After doing Mobile Navbar, we are implementing Global Search.
For this we will create a new Search Folder inside shared folder. This will have all the shared components that we need.
Inside that search folder, make there a "GlobalSearch.tsx" file

🛑🛑🛑🛑 For SVG Icons: https://flowbite.com/icons/

🛑🛑 Section 1:
Now we work on the Left Side Bar, for that we make the component of LeftSidebar in (root) > layout file active, then we start working on the components > shared > LeftSidebar.tsx.

🛑🛑 Section 2:
Now we work on the Right Side Bar, for that we make the component of RightSidebar in (root) > layout file active, then we start working on the components > shared > RightSidebar.tsx.

Now while working on the right side section's HOT QUESTIONS part, we will later apply a recommendations algorithm which will take us to the asked question when we click on it directly.

For now, we will just use a piece of text to map over it and see if it is working in the front end part or not.

Now for Popular tags, we see that these tags are used in many parts, so for that, we will make a new file:
devflow > components > shared > RenderTag.tsx

Now for tags in Render Tags page, we will use Badge component for the layout.
🛑🛑 // https://ui.shadcn.com/docs/components/badge

🛑🛑 Now we will create our local dearch bar component, for that we will make this following file: components > shared > search > LocalSearchbar.tsx.

Then activate it as a component in: app > (root) > (home) > page.tsx

🛑🛑 Now we will create our filter component, for that we will make this following file: components > shared > Filter.tsx.

Then activate it as a component in: app > (root) > (home) > page.tsx

Now for filters, we will need another Shadcn component, here we have taken the help of "Select"

[Select Shadcn Docs](https://ui.shadcn.com/docs/components/select)

Now for the Home Page Filters in Tag form, create a new component in: components > home > HomeFilters.tsx.

Also call it in app -> (root) -> (home) -> page.tsx in Home() function.

Now we will start making the Home Page Card Components in (root) -> (home) -> page.tsx in Home() function, below HomeFilters component.

Now first part in the Question Card is making the NoResult Component.
For that, let us make the following: components > shared > NoResult.tsx

and import it in app > (root) > (home) > page.tsx in Home()

Now we start making the QuestionCard. For that we will first make a cards folder in components > cards > QuestionCard.tsx

and import it in app > (root) > (home) > page.tsx in Home()

Now inside the QuestionCard, we see a format where we have image on the left and text on the right, like for author, like , answers and views. These are called "metrics". We make these as re-usable components.

Let us do the following: components > shared > Metric.tsx

and import it in components > cards > QuestionCard.tsx in QuestionCard().

🛑🛑🛑 Inside QuestionCards.tsx Converting the long string time stamp into something nice and readible
🛑🛑 We can create a new utility function and use it across different places go to lib > utils.tsx

Now say in views or answers or other things, say we have a large number like 110000000, this will disorient our card and we will not be able to see things clearly.

For this, let us try to convert 1100000000 to 1.1 Billion or B such format.

For this we will make another utility function: lib > utils.ts

🛑🛑 Now we have started working on Ask a Question Page, for that, we will go to app > (root) > ask-question > page.tsx > Page

Now here we will create our Question Component

components > forms > Question.tsx > Question()

and import it in app > (root) > ask-question > page.tsx > Page

We will first create a form, for that we will import the form component from shadcn UI.

https://ui.shadcn.com/docs/components/form

Here we see that though shadcn has its own components for creating forms, it uses React Hook Form and Zod for creating forms.

Steps to create a form:

1. Install the form component from shadcn ui
2. Create a form schema i.e. defining the shape of our form using "zod"

Zod - TypeScript-first schema validation with static type inference

Zod ensures that the type of data that we are passing in the form is exactly as we have declared it.

3. Define the useForm hook from React Hook Form to create a form.

4. Building a form

Done, we have made a simple form with username and submit button.
This all is in the form schema.

But we need more things in our formSchema i.e. modify our formSchema, for this, we have to take it to 🛑lib > validations.ts 🛑

So copy the form schema and paste it there.

Now if we want to have a special type of validation, we can find built-in validations in zod.

For that go to [Zod Documentation](https://zod.dev/?id=strings)

We can also provide special and customized error messages when we give these validations.

Let us first work on validations.tsx

After working on validations and Question.tsx, and making the form and fields of all three and finishing the first form.

Let us now work on the question description field. For that, we will use the tiny mce editor which is a great what you see is what you get editor.

So first import the tiny mce editor

[Editor Docs](https://www.tiny.cloud/docs/tinymce/latest/react-cloud/)

Then we import the useRef and Editor in components > forms > Question.tsx.

Finally insert the editor component inside the form control tag in the second descriptive field.

Then we work with the Tags in the same Page.

Finally we work on the 'onSubmit' of the form.
