// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import "jest-canvas-mock";
// import axios from "axios";
jest.mock("axios");
// jest.mock("grapesjs");

// Mock ClipboardEvent
global.ClipboardEvent = class ClipboardEvent extends Event {
  constructor(type, options) {
    super(type, options);
    this.clipboardData = {
      getData: jest.fn(),
      setData: jest.fn(),
    };
  }
};
global.ResizeObserver = require("resize-observer-polyfill");
// Mock DragEvent
global.DragEvent = class DragEvent extends Event {
  constructor(type, options) {
    super(type, options);
    this.dataTransfer = {
      getData: jest.fn(),
      setData: jest.fn(),
    };
  }
};

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return null;
  }

  unobserve() {
    return null;
  }
};

window.matchMedia =
  window.matchMedia ||
  (() => {
    return { matches: false, addListener: () => {}, removeListener: () => {} };
  });

jest.mock("@mui/material", () => {
  const modules = jest.requireActual("@mui/material");
  return {
    __esModule: true,
    ...modules,
    useMediaQuery: jest.fn(() => true),
  };
});
jest.mock("react-apexcharts");
jest.mock("react-medium-image-zoom", () => {
  return {
    __esModule: true,
    A: true,
    default: () => {
      return <div>react medium image zoom is mocked </div>;
    },
  };
});
