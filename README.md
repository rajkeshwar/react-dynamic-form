Here’s an improved and professional version of your `README.md` file with better structure, grammar, and clarity:

---

````markdown
# TriFloorPlan Demo Application

This is a demo application showcasing the `TriFloorPlan` component from the [`@tririga/tririga-react-components`](https://www.npmjs.com/package/@tririga/tririga-react-components) library.  
It provides an interactive floor plan viewer with capabilities such as pin placement, space selection, zooming, and panning.

## 🛠 Prerequisites

- **Node.js** v14 or higher
- **npm** v6 or higher

## 📦 Installation

To install the dependencies, run:

```bash
npm install --legacy-peer-deps
````

> The `--legacy-peer-deps` flag is required to resolve potential version conflicts with peer dependencies.

## ⚙️ Important Notes

The `TriFloorPlan` component internally makes API calls to fetch floor plan data. Since these API calls are encapsulated within the component and not exposed externally, we have **monkey-patched** the following functions to simulate backend responses:

* `fetch`
* `getFloorplan`

These patches return mock data to allow the component to render and behave as if it were connected to a real backend. This is necessary for the demo to function correctly.

## 🚀 Features Demonstrated

* Floor plan rendering
* Interactive space and pin selection
* Zoom and pan controls
* Mocked backend responses for isolated demo usage

## 🧪 Running the App

```bash
npm run dev
```

Then open your browser and navigate to:
[http://localhost:5173](http://localhost:5173) (or the port configured by Vite)

