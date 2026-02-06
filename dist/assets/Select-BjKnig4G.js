import{j as e}from"./index-BOLkSH9S.js";const m=({label:a,options:c=[],value:n,onChange:o,error:s,required:r=!1,disabled:t=!1,placeholder:d="Select an option",className:i="",...x})=>e.jsxs("div",{className:"space-y-1",children:[a&&e.jsxs("label",{className:"block text-sm font-medium text-gray-700",children:[a,r&&e.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),e.jsxs("select",{value:n,onChange:o,disabled:t,required:r,className:`
          w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-transparent
          ${s?"border-red-300 focus:ring-red-500":"border-gray-300"}
          ${t?"bg-gray-100 cursor-not-allowed":"bg-white"}
          ${i}
        `,...x,children:[e.jsx("option",{value:"",children:d}),c.map(l=>e.jsx("option",{value:l.value,children:l.label},l.value))]}),s&&e.jsx("p",{className:"text-sm text-red-600",children:s})]});export{m as S};
