import * as selection from "d3-selection";
import * as transition from "d3-transition";
import * as ease from "d3-ease";
import * as geo from "d3-geo";

const d3 = Object.assign({},
  selection,
  transition,
  ease,
  geo,
);

export default d3;
