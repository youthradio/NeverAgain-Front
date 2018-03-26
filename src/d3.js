import * as selection from "d3-selection";
import * as transition from "d3-transition";
import * as ease from "d3-ease";
import * as request from "d3-request";
import * as queue from "d3-queue";
import * as geo from "d3-geo";
import completeAssign from "./util/complete-assign";

const d3 = completeAssign({},
  selection,
  transition,
  ease,
  request,
  geo,
  queue
);

export default d3;
