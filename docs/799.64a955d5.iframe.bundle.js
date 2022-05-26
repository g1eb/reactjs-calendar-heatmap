"use strict";(self.webpackChunk_manufac_reactjs_calendar_heatmap=self.webpackChunk_manufac_reactjs_calendar_heatmap||[]).push([[799],{"./src/MonthOverviewHeatmap/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{j:()=>MonthOverviewHeatMap});__webpack_require__("./node_modules/core-js/modules/es.object.keys.js"),__webpack_require__("./node_modules/core-js/modules/es.array.index-of.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.array.is-array.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.from.js"),__webpack_require__("./node_modules/core-js/modules/es.array.slice.js"),__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.set.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.map.js"),__webpack_require__("./node_modules/core-js/modules/es.number.is-finite.js"),__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.array.filter.js"),__webpack_require__("./node_modules/core-js/modules/es.object.assign.js");var src=__webpack_require__("./node_modules/d3/src/index.js"),react=__webpack_require__("./node_modules/react/index.js"),utils=__webpack_require__("./src/utils.ts"),startOfMonth=(__webpack_require__("./node_modules/core-js/modules/es.array.reduce.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-iso-string.js"),__webpack_require__("./node_modules/core-js/modules/es.object.values.js"),__webpack_require__("./node_modules/core-js/modules/es.number.parse-int.js"),__webpack_require__("./node_modules/date-fns/esm/startOfMonth/index.js")),endOfMonth=__webpack_require__("./node_modules/date-fns/esm/endOfMonth/index.js"),format=__webpack_require__("./node_modules/date-fns/esm/format/index.js");function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function getWeekLabel(week){return"Week "+week}var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),_excluded=["data","color","onCellClick","onTooltip","onHideTooltip","fade","onFadeComplete","response"];function MonthOverviewHeatmap_slicedToArray(arr,i){return function MonthOverviewHeatmap_arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function MonthOverviewHeatmap_iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||MonthOverviewHeatmap_unsupportedIterableToArray(arr,i)||function MonthOverviewHeatmap_nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _toConsumableArray(arr){return function _arrayWithoutHoles(arr){if(Array.isArray(arr))return MonthOverviewHeatmap_arrayLikeToArray(arr)}(arr)||function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||MonthOverviewHeatmap_unsupportedIterableToArray(arr)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function MonthOverviewHeatmap_unsupportedIterableToArray(o,minLen){if(o){if("string"==typeof o)return MonthOverviewHeatmap_arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?MonthOverviewHeatmap_arrayLikeToArray(o,minLen):void 0}}function MonthOverviewHeatmap_arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}function MonthOverviewHeatMap(_ref){var data=_ref.data,color=_ref.color,onCellClick=_ref.onCellClick,onTooltip=_ref.onTooltip,onHideTooltip=_ref.onHideTooltip,fade=_ref.fade,onFadeComplete=_ref.onFadeComplete,response=_ref.response,rest=_objectWithoutProperties(_ref,_excluded),ref=(0,react.useRef)(null);return(0,react.useEffect)((function(){var margin={top:50,bottom:50,left:50,right:50},svg=void 0,resize=void 0;if(null!==ref.current&&data.length>0){var _getMonthData=function getMonthData(data){var _minTotal,_maxTotal,minTotal,maxTotal,dataRecord=data.reduce((function(acc,curr){var _Object$assign;return Object.assign({},acc,((_Object$assign={})[new Date(curr.date).getDate().toString()]=curr,_Object$assign))}),{}),dataArray=[];if(data.length>0){var selectedDate=new Date(data[0].date),minDate=(0,startOfMonth.Z)(selectedDate),maxDate=(0,endOfMonth.Z)(selectedDate),consecutiveDatesRecord=(0,src.Nus)(minDate,maxDate).reduce((function(acc,curr){var _Object$assign2;return Object.assign({},acc,((_Object$assign2={})[curr.getDate().toString()]={date:curr.toISOString(),total:NaN},_Object$assign2))}),{}),combinedData=Object.assign({},consecutiveDatesRecord,dataRecord);dataArray=Object.values(combinedData).map((function(d){var date=new Date(d.date);return{day:Number.parseInt((0,format.Z)(date,"i"),10),week:Number.parseInt((0,format.Z)(date,"I"),10),total:d.total}})),"1"===(0,format.Z)(selectedDate,"M")&&(dataArray=(0,utils.yF)(dataArray));var _extent2=_slicedToArray((0,src.Wem)(dataArray,(function(d){return d.total})),2);minTotal=_extent2[0],maxTotal=_extent2[1]}return{dataArray,totalExtent:[null!==(_minTotal=minTotal)&&void 0!==_minTotal?_minTotal:NaN,null!==(_maxTotal=maxTotal)&&void 0!==_maxTotal?_maxTotal:NaN]}}(data),dataArray=_getMonthData.dataArray,totalExtent=_getMonthData.totalExtent,dayLabels=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],weekLabels=_toConsumableArray(new Set(dataArray.map((function(e){return getWeekLabel(e.week)})))),_totalExtent=MonthOverviewHeatmap_slicedToArray(totalExtent,2),minTotal=_totalExtent[0],maxTotal=_totalExtent[1],colorGenerator=(0,utils.D0)(minTotal,maxTotal,color),_getXScaleAndAxis2=MonthOverviewHeatmap_slicedToArray((0,utils.DW)({labels:weekLabels,element:ref.current,margin,paddingInner:.2,response}),2),xScale=_getXScaleAndAxis2[0],xAxis=_getXScaleAndAxis2[1],_getYScaleAndAxis2=MonthOverviewHeatmap_slicedToArray((0,utils.jH)({labels:dayLabels,element:ref.current,margin,paddingInner:0,response}),2),yScale=_getYScaleAndAxis2[0],yAxis=_getYScaleAndAxis2[1],parent=(svg=(0,src.Ys)(ref.current).append("svg").attr("width","100%").attr("height","100%").style("cursor","pointer")).append("g").attr("transform","translate("+margin.left+", "+margin.top+")");svg.append("g").attr("transform","translate("+margin.left+", "+margin.top+")").attr("class","x-axis").call(xAxis),svg.append("g").attr("transform","translate("+margin.left+", "+margin.top+")").attr("class","y-axis").call(yAxis),parent.selectAll(".heat-cell").data(dataArray).enter().append("rect").attr("class","heat-cell").attr("width",xScale.bandwidth()).attr("height",yScale.bandwidth()).attr("x",(function(d){var _xScale;return null!==(_xScale=xScale(getWeekLabel(d.week)))&&void 0!==_xScale?_xScale:0})).attr("y",(function(d){var _yScale;return null!==(_yScale=yScale(dayLabels[d.day-1]))&&void 0!==_yScale?_yScale:0})).attr("fill",(function(d){return Number.isFinite(d.total)?colorGenerator(d.total):"none"})).attr("stroke-width",1).attr("pointer-events",(function(d){return 0===d.total?"none":"visiblePainted"})),(0,src.td_)(".heat-cell").on("mouseover",(function(e,datum){(0,src.Ys)(e.currentTarget).attr("fill-opacity",.4),null==onTooltip||onTooltip({value:datum})})).on("mousemove",(function(_e,datum){null==onTooltip||onTooltip({value:datum})})).on("mouseout",(function(e){(0,src.Ys)(e.currentTarget).attr("fill-opacity",1),null==onHideTooltip||onHideTooltip()})).on("click",(function(_e,datum){(0,utils.Fe)([".heat-cell",".x-axis",".y-axis"]).then((function(){null==onCellClick||onCellClick(datum)}))})),(0,src.Ys)(".x-axis").selectAll("text").on("mouseover",(function(_e,tickLabel){(0,src.td_)(".heat-cell").filter((function(d){return getWeekLabel(d.week)!==tickLabel})).transition().duration(500).ease(src.Nyw).attr("fill-opacity",.2)})).on("mouseout",(function(){(0,src.td_)(".heat-cell").transition().duration(500).ease(src.Nyw).attr("fill-opacity",1)})),(0,src.Ys)(".y-axis").selectAll("text").on("mouseover",(function(_e,tickLabel){(0,src.td_)(".heat-cell").filter((function(d){return dayLabels[d.day-1]!==tickLabel})).transition().duration(500).ease(src.Nyw).attr("fill-opacity",.2)})).on("mouseout",(function(){(0,src.td_)(".heat-cell").transition().duration(500).ease(src.Nyw).attr("fill-opacity",1)})),resize=function resize(){if(null!==ref.current){var _getXScaleAndAxis4=MonthOverviewHeatmap_slicedToArray((0,utils.DW)({labels:weekLabels,element:ref.current,margin,paddingInner:.2,response}),2),newXScale=_getXScaleAndAxis4[0],newXAxis=_getXScaleAndAxis4[1],_getYScaleAndAxis4=MonthOverviewHeatmap_slicedToArray((0,utils.jH)({labels:dayLabels,element:ref.current,margin,paddingInner:0,response}),2),newYScale=_getYScaleAndAxis4[0],newYAxis=_getYScaleAndAxis4[1];(0,src.Ys)(".x-axis").call(newXAxis).attr("transform","translate("+margin.left+", "+margin.top+")"),(0,src.Ys)(".y-axis").call(newYAxis).attr("transform","translate("+margin.left+", "+margin.top+")"),(0,src.td_)(".heat-cell").transition().duration(500).ease(src.Nyw).attr("width",newXScale.bandwidth()).attr("height",newYScale.bandwidth()).attr("x",(function(d){var _newXScale;return null!==(_newXScale=newXScale(getWeekLabel(d.week)))&&void 0!==_newXScale?_newXScale:0})).attr("y",(function(d){var _newYScale;return null!==(_newYScale=newYScale(dayLabels[d.day-1]))&&void 0!==_newYScale?_newYScale:0}))}},window.addEventListener("resize",resize)}return function(){var _svg;void 0!==resize&&window.removeEventListener("resize",resize),null===(_svg=svg)||void 0===_svg||_svg.remove()}}),[color,data,onCellClick,onHideTooltip,onTooltip,response]),(0,react.useEffect)((function(){!0===fade&&(0,utils.Fe)([".heat-cell",".x-axis",".y-axis"]).then((function(){null==onFadeComplete||onFadeComplete()}))}),[fade,onFadeComplete]),(0,jsx_runtime.jsx)("div",Object.assign({},rest,{style:Object.assign({width:"100%",height:"100%",boxSizing:"border-box"},rest.style),ref}))}MonthOverviewHeatMap.displayName="MonthOverviewHeatMap";try{MonthOverviewHeatMap.displayName="MonthOverviewHeatMap",MonthOverviewHeatMap.__docgenInfo={description:"Ref: https://bl.ocks.org/Bl3f/cdb5ad854b376765fa99",displayName:"MonthOverviewHeatMap",props:{data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"CalendarHeatmapDatum[]"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string"}},fade:{defaultValue:null,description:"",name:"fade",required:!1,type:{name:"boolean"}},response:{defaultValue:null,description:"",name:"response",required:!1,type:{name:"enum",value:[{value:'"rotate"'},{value:'"offset"'},{value:'"hide"'}]}},onCellClick:{defaultValue:null,description:"",name:"onCellClick",required:!1,type:{name:"((d: MonthOverviewDatum) => void)"}},onTooltip:{defaultValue:null,description:"",name:"onTooltip",required:!1,type:{name:"((datum: { value: unknown; }) => void)"}},onHideTooltip:{defaultValue:null,description:"",name:"onHideTooltip",required:!1,type:{name:"(() => void)"}},onFadeComplete:{defaultValue:null,description:"",name:"onFadeComplete",required:!1,type:{name:"(() => void)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/MonthOverviewHeatmap/index.tsx#MonthOverviewHeatMap"]={docgenInfo:MonthOverviewHeatMap.__docgenInfo,name:"MonthOverviewHeatMap",path:"src/MonthOverviewHeatmap/index.tsx#MonthOverviewHeatMap"})}catch(__react_docgen_typescript_loader_error){}},"./node_modules/date-fns/esm/endOfMonth/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>endOfMonth});var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/date-fns/esm/toDate/index.js"),_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/date-fns/esm/_lib/requiredArgs/index.js");function endOfMonth(dirtyDate){(0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__.Z)(1,arguments);var date=(0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__.Z)(dirtyDate),month=date.getMonth();return date.setFullYear(date.getFullYear(),month+1,0),date.setHours(23,59,59,999),date}},"./node_modules/date-fns/esm/startOfMonth/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>startOfMonth});var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/date-fns/esm/toDate/index.js"),_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/date-fns/esm/_lib/requiredArgs/index.js");function startOfMonth(dirtyDate){(0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__.Z)(1,arguments);var date=(0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__.Z)(dirtyDate);return date.setDate(1),date.setHours(0,0,0,0),date}}}]);