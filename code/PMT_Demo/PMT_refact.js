var defaultData = 1; 
var x = 0;
var y = 0;

var Data;

var view = ["Grid"];
var state = ["Result"];
var filter = ["Reset"];
var sort = ["Default"];

var wardCount = {};
var organismCount = {};
var techCount = {};

var colorMap = {Positive:"#d95f02", Negative:"#b2df8a"};
var color = d3.scale.category20();

var parseDate = d3.time.format("%Y-%m-%d").parse;
var formatTime = d3.time.format("%B %e, %Y");
var formatTimeSmall = d3.time.format("%b %e, %Y");
var dateFn = function(d) {return formatTime(parseDate(d.Date))};

var title = d3.select("#dateRange")
                .append("h4");

function updateDateRange(Data){
    var dateRangefirst = d3.min(Data, dateFn);
    var dateRangelast = d3.max(Data, dateFn);
    dateRangeTitle(dateRangefirst, dateRangelast);
}

function dateRangeTitle(dateRangefirst, dateRangelast){
    var titleUpdate1 = title.html("Date Range: " + dateRangefirst + " - " + dateRangelast);
}

function countery() {
    y++;
}

function counterx() {
    x++;
}

function resetCounter() {
    x=0;
    y=0;
}

function activeColorBy(self){
    d3.select(".ColorBy").selectAll(".btn").classed("active", false);
    d3.select(self).classed("active", true);

}

function activeSortBy(self){
    d3.select(".SortBy").selectAll(".btn").classed("active", false);
    d3.select(self).classed("active", true);

}

function activeFilterBy(self){
    if (self === 0) {
        d3.select(".FilterBy").selectAll(".btn").classed("active", false);
    }else{
        d3.select(".FilterBy").selectAll(".btn").classed("active", false);
        d3.select(self).classed("active", true);
    }
}

function enableButtons(){
    d3.selectAll("button").property("disabled", false);
    d3.select(".search").classed("collapse", false);
    d3.select("#colorByCollapse").classed("collapse", false);
    d3.select("#ColorLegend").classed("collapse", false);
    d3.selectAll("#resizeCollapse").classed("collapse", false);

}

function disableButtons(){
    d3.selectAll("button").property("disabled", true);
    d3.select(".search").classed("collapse", true);
    d3.select("#colorByCollapse").classed("collapse", true);
    d3.select("#ColorLegend").classed("collapse", true);
    d3.selectAll("#resizeCollapse").classed("collapse", true);
    d3.select("#SampleDetails").classed("collapse", true);

}

function main(Data){

    var countBy = ["d.Ward_Name", "d.Organism", "d.Tech"];

    for(var t = 0; t<countBy.length; t++){
        if(countBy[t] === "d.Ward_Name"){
            var count = d3.nest()
                          .key(function(d) {return eval(countBy[t]);})
                          .rollup(function(d) {return d.length;})
                          .entries(Data);

            for(var p = 0; p<count.length; p++){
                wardCount[count[p].key] = count[p].values;
            }
        }else if (countBy[t] === "d.Organism"){
            var count = d3.nest()
                          .key(function(d) {return eval(countBy[t]);})
                          .rollup(function(d) {return d.length;})
                          .entries(Data);

            for(var p = 0; p<count.length; p++){
                organismCount[count[p].key] = count[p].values;
            }
        }else if (countBy[t] === "d.Tech"){
            var count = d3.nest()
                          .key(function(d) {return eval(countBy[t]);})
                          .rollup(function(d) {return d.length;})
                          .entries(Data);

            for(var p = 0; p<count.length; p++){
                techCount[count[p].key] = count[p].values;
            }
        }else{

        }
    }

    var radiusSet = 15;       
    var nRow = 20;

    var rowsNeeded = Math.ceil(Data.length/nRow);

    var width = nRow*41;
    var dpr = width/radiusSet;

    var height = rowsNeeded*38;
    var dataLength = d3.range(1, Data.length + 1);

    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-20, 0])
                .html(function(d) {
                    if (d.Positive === 1) {
                        return  "<strong>Order:</strong> <span style='color:#d95f02'>" + d.Order_ID  + "</span><br>" +
                                "<strong>Date:</strong> <span style='color:#d95f02'>" + formatTime(parseDate(d.Date)) + "</span><br>" +
                                "<strong>Ward Name:</strong> <span style='color:#d95f02'>" + d.Ward_Name + "</span><br>"+
                                "<strong>Result:</strong> <span style='color:#d95f02'>" + d.Type + "</span><br>" +
                                "<strong>Organism(s):</strong> <span style='color:#d95f02'>" + d.Organism + "</span><br>" +
                                "<strong>Tech:</strong> <span style='color:#d95f02'>" + d.Tech + "</span>";
                    }else{
                        return  "<strong>Order:</strong> <span style='color:#b2df8a'>" + d.Order_ID  + "</span><br>" +
                                "<strong>Date:</strong> <span style='color:#b2df8a'>" + formatTime(parseDate(d.Date)) + "</span><br>" +
                                "<strong>Ward Name:</strong> <span style='color:#b2df8a'>" + d.Ward_Name + "</span><br>"+
                                "<strong>Result:</strong> <span style='color:#b2df8a'>" + d.Type + "</span><br>" +
                                "<strong>Tech:</strong> <span style='color:#b2df8a'>" + d.Tech + "</span>";
                    }
                });

    var canvas = d3.select("#viz")
                    .append("svg")
                    .attr("class", "viz")
                    .attr("width", width)
                    .attr("height", height);

    canvas.call(tip);

    var group = canvas.append("g")
                        .attr("transform", "translate(30, -75)");

    var samples = group.selectAll("circle")
                        .data(Data)
                        .enter()
                        .append("circle");

    var samplesAttr = samples
                        .attr("class", "show")
                        .attr("cx", function(d,i) {
                            if (i % nRow === 0 && i != 0) {
                                counterx()
                                return ((i - (x*nRow))* 40);
                            }else{
                                return ((i - (x*nRow))* 40);
                        }})
                        .attr("cy", function(d,i) {
                            if (i % nRow === 0 && i != 0) {
                                countery()
                                return (y/2.7*100) + 100; 
                            }else{ 
                                return (y/2.7*100) + 100;
                        }})
                        .attr("r", 15)
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .style("fill", function(d) {
                            if (d.Positive === 1) {
                                return "#d95f02";
                            }else{
                                return "#b2df8a";
                        }})
                        .on("mouseover", function(d) {
                            d3.select(this)
                                .style({fill:"#1f78b4"}); 
                            tip.show(d);
                        })
                        .on("mouseout", function(d) {
                            mouseOut();
                            tip.hide(d);
                        })
                        .on("click", function(d) {
                            d3.select(".collapse").classed("collapse", false);
                            d3.select(".selected").classed("selected", false);
                            d3.select(this).classed("selected", true).style({fill:"black"});
                            mouseOut();
                            d3.select("#Order").text(d.Order_ID);
                            d3.select("#Date").text(d.Date);
                            d3.select("#Ward").text(d.Ward_Name.slice(0,25) + ((d.Ward_Name[26]) ? "..." : "")); 
                            d3.select("#Result").text(d.Type);
                            d3.select("#Organism").text(d.Organism);
                            d3.select("#TechSide").text(d.Tech);
                            d3.event.stopPropagation();
                        });

    var noHideSelected = d3.select("body").selectAll("div")
            .filter(function (d){
                return this.parentNode.parentNode.className === "list-group";
             })
            .on("click", function(d) {
                if (d3.selectAll(".selected")){
                    d3.event.stopPropagation();
                }else{

                }
            });
       
    var hideSelected = d3.select("body").selectAll("div:not(.btn)")
            .filter(function (d){
                return this.parentNode.parentNode.className !== "list-group";
             })
            .on("click", function(d) {
                if (d3.selectAll(".selected")){
                    d3.select("#SampleDetails").classed("collapse", true);
                    d3.select(".selected").classed("selected", false);
                    mouseOut();
                }else{

                }
            });

    function mouseOut() {
        colorMap = {};
        d3.selectAll("circle:not(.selected)")
            .style({fill: function(d,i) {
                if (state[0] === "Result"){
                    if (d.Type === "Positive") {
                        if (colorMap[d.Type]){

                        }else{
                            colorMap[d.Type] = "#d95f02";
                        }
                        return "#d95f02";
                    }else{
                        if (colorMap[d.Type]){

                        }else{
                            colorMap[d.Type] = "#b2df8a";
                        }
                        return "#b2df8a";
                    }
                }else if (state[0] === "Ward"){
                    if (colorMap[d.Ward_Name]){

                    }else{
                        colorMap[d.Ward_Name] = color(d.Ward_Name);
                    }
                    return color(d.Ward_Name);
                }else if (state[0] === "Date"){
                    if (colorMap[d.Date]){

                    }else{
                        colorMap[d.Date] = color(d.Date);
                    }
                    return color(d.Date);
                }else if (state[0] === "Organism"){
                    if (colorMap[d.Organism]){

                    }else{
                        colorMap[d.Organism] = color(d.Organism);
                    }
                    return color(d.Organism);
                }else if (state[0] === "Tech"){
                    if (colorMap[d.Tech]){

                    }else{
                        colorMap[d.Tech] = color(d.Tech);
                    }
                    return color(d.Tech);
                }
            }});
    
        d3.selectAll("circle.searched")
            .style("fill", "purple");

        d3.select("circle.selected")
            .style({fill:"black"});

    }

    function update() {
        if (filter[0] === "PositiveOnly"){
            var data = Data.filter(function (d) {return d.Positive === 1;});
            var datalength = data.length;
        }else if (filter[0] === "NegativeOnly"){
            var data = Data.filter(function (d) {return d.Positive === 0;});
            var datalength = Data.filter(function (d) {return d.Positive === 0;}).length;
        }else{
            var data = Data;
            var datalength = data.length;
        }

        var heightRange = d3.scale.linear().domain([5, 15]).range([-92.5,-74]);
        var widthRange = d3.scale.linear().domain([5, 15]).range([8,26]);

        var nRadius = +document.getElementById("nRadius").value;
        var nRow = +document.getElementById("nRow").value;     

        d3.select("#nRadius").property("value", nRadius);
        d3.select("nRow").property("value", nRow);
        d3.select("#nRadius-value").text(nRadius);
        d3.select("#nRow-value").text(nRow);

        resetCounter();
       
        samplesAttrSorted = samplesAttr.sort(function(a,b){
            if (sort[0] === "Result"){
                return d3.descending(a.Type, b.Type);
            }else if (sort[0] === "Ward"){
                return d3.descending(wardCount[a.Ward_Name], wardCount[b.Ward_Name]);
            }else if (sort[0] === "Date"){
                return d3.ascending(a.Date, b.Date);
            }else if (sort[0] === "Organism"){
                return d3.descending(organismCount[a.Organism], organismCount[b.Organism]);
            }else if (sort[0] === "Tech"){
                return d3.descending(techCount[a.Tech], techCount[b.Tech]);
            }else if (sort[0] === "Order"){
                return d3.ascending(a.Order_ID, b.Order_ID);
            }else{
                return d3.ascending(a.Order_ID, b.Order_ID);
            }});

        if (filter[0] === "PositiveOnly"){
            filteredBase = samplesAttrSorted
                            .filter(function (d) {return d.Positive === 1;});
            redrawSamples(filteredBase); 
        }else if (filter[0] === "NegativeOnly"){
            filteredBase = samplesAttrSorted
                            .filter(function (d) {return d.Positive === 0;});
            redrawSamples(filteredBase);
        }else{
            base = samplesAttrSorted;
            redrawSamples(base);
        }

        function redrawSamples(base){

            base.attr("r", nRadius)
                .attr("cx", function(d,i) {
                    if (i % nRow === 0 && i != 0) {
                        counterx()
                        return ((i - (x*nRow)) * 40 / (15/nRadius));
                    }else{
                        return ((i - (x*nRow)) * 40/ (15/nRadius));
                    }
                })
                .attr("cy", function(d,i) {
                    if (i % nRow === 0 && i != 0) { 
                        countery()
                        return (y/(2.7*(15/nRadius))*100) + 100; 
                    }else{ 
                        return (y/(2.7*(15/nRadius))*100) + 100;
                    }
                });

            var position = d3.select(".viz").selectAll("circle.show")[0];
            var yPosition = position[base.size()-1].attributes.cy.value;
            var xPosition = position[nRow-1].attributes.cx.value;
            var xDiff = xPosition - position[nRow-2].attributes.cx.value;
            
            canvas
                .attr("width", (+d3.round(xPosition) + 3.75*nRadius + ((nRadius < 6) ? 1.5 : 0)))
                .attr("height", (+d3.round(yPosition) + widthRange(nRadius) + heightRange(nRadius) + nRadius/2));

            group
                .attr("transform", "translate("+ widthRange(nRadius) +", " + heightRange(nRadius) +")");
        }

        updateDateRange(data);
        updateLegend();
    }

    function nestLegendData(Data){

        if (filter[0] === "PositiveOnly"){
            var data = Data.filter(function (d) {return d.Positive === 1;});
        }else if (filter[0] === "NegativeOnly"){
            var data = Data.filter(function (d) {return d.Positive === 0;});
        }else{
            var data = Data;
        }

        if (state[0] === "Result"){
            var legendLabel = "d.Type";
        }else if (state[0] === "Ward"){
            var legendLabel = "d.Ward_Name";
        }else if (state[0] === "Date"){
            var legendLabel = "d.Date";
        }else if (state[0] === "Organism"){
            var legendLabel = "d.Organism";
        }else if (state[0] === "Tech"){
            var legendLabel = "d.Tech";
        }else{
            var legendLabel = "d.Type";
        }

        var nest = d3.nest()
                      .key(function(d) {return eval(legendLabel);})
                      .rollup(function(d) {return d.length;})
                      .entries(data);

        if (state[0] === "Date"){
            nest.sort(function(a, b){return d3.ascending(a.key, b.key);});
        }else{
            nest.sort(function(a, b){return d3.ascending(b.values, a.values);});
        }

        return nest;

    }

    function initializeLegend(nest){

        var legendRowClass = d3.select("#ColorLegend")
                            .selectAll("div")
                            .data(nest)
                            .enter()
                            .append('div')
                            .attr("class", "row-fluid")
                            .append("div")
                            .style("width", "90%")
                            .attr("class", "form-inline");

        var legendColor2 = legendRowClass
                            .append("div")
                            .attr("class", "legendColor")
                            .style("background", function (d) {
                                return colorMap[d.key];
                            })
                            .style("border", "2px")
                            .style("border-style", "solid")
                            .style("display", "inline-block")
                            .style("width", "35px")
                            .style("margin-top", "1px")
                            .style("margin-bottom", "1px")
                            .html('&nbsp');
                            
        var legend = legendRowClass
                        .append("div")
                        .attr("class", "legendLabel")
                        .style("display", "inline-block")
                        .style("width", "125px")
                        .style('margin-left', '5px')
                        .html(function(d, i){
                            var a = d.key.slice(0,18);
                            var b = d.key[20] ? "..." : ""; 
                            return "<b>" + a + b + " - " + d.values + "</b>"; 
                        });

        var legend2 = legendRowClass
                        .append("div")
                        .attr("class", "legendSum")
                        .style("display", "inline-block")
                        .style("width", "100px")
                        .style('margin-left', '5px')
                        .html(function(d, i){
                            return ""; 
                        }); 

    }

    function updateLegend(){

        nest = nestLegendData(Data);

        var selection = d3.select("body")
                    .select(".col-md-3")
                    .select("#ColorLegend")
                    .selectAll(".row-fluid").data(nest);

        var updateColor = selection.select(".legendColor")
                                .style("background", function (d) {
                                    return colorMap[d.key];
                                })

        var updateText = selection.select(".legendLabel")
                                .html(function(d, i){
                                    var a = d.key.slice(0,18);
                                    var b = d.key[20] ? "..." : ""; 
                                    return "<b>" + a + b + " - " + d.values + "</b>"; 
                                });

        var updateSum = selection.select(".legendSum")
                                .style('margin-left', '5px')
                                .html(function(d, i){
                                    return ""; 
                                }); 

        var enterSelection = selection.enter()
                            .append('div')
                            .attr("class", "row-fluid")
                            .append("div")
                            .style("width", "90%")
                            .attr("class", "form-inline");

        var enterColor = enterSelection.append("div")
                            .attr("class", "legendColor")
                            .style("background", function (d) {
                                return colorMap[d.key];
                            })
                            .style("border", "2px")
                            .style("border-style", "solid")
                            .style("display", "inline-block")
                            .style("width", "35px")
                            .style("margin-top", "1px")
                            .style("margin-bottom", "1px")
                            .html('&nbsp');

        var enterText = enterSelection.append("div")
                                .attr("class", "legendLabel")
                                .style("display", "inline-block")
                                .style("width", "125px")
                                .style('margin-left', '5px')
                                .html(function(d, i){
                                    var a = d.key.slice(0,18);
                                    var b = d.key[20] ? "..." : ""; 
                                    return "<b>" + a + b + " - " + d.values + "</b>"; 
                                });

        var enterSum = enterSelection.append("div")
                                .attr("class", "legendSum")
                                .style("display", "inline-block")
                                .style("width", "100px")
                                .style('margin-left', '5px')
                                .html(function(d, i){
                                    return ""; 
                                }); 

        selection.exit().remove();

    }

    update();

    nest = nestLegendData(Data);

    initializeLegend(nest);

    d3.select("#buttonSortResult").on("click", function() {
                                sort = ["Result"];
                                activeSortBy(this);
                                update();
                                });

    d3.select("#buttonSortWard").on("click", function() {
                                sort = ["Ward"];
                                activeSortBy(this);
                                update();
                                });

    d3.select("#buttonSortDate").on("click", function() {
                                sort = ["Date"];
                                activeSortBy(this);
                                update();
                                });

    d3.select("#buttonSortOrganism").on("click", function() {
                                sort = ["Organism"];
                                activeSortBy(this);
                                update();
                                });

    d3.select("#buttonSortTech").on("click", function() {
                                sort = ["Tech"];
                                activeSortBy(this);
                                update();
                                });

    d3.select("#buttonSortOrder").on("click", function() {
                                sort = ["Order"];
                                activeSortBy(this);
                                update();
                                });

    d3.select("#buttonResult").on("click", function() {
                                state = ["Result"];
                                activeColorBy(this);
                                mouseOut();
                                updateLegend();
                                });

    d3.select("#buttonWard").on("click", function() {
                                state = ["Ward"];
                                activeColorBy(this);
                                mouseOut();
                                updateLegend();
                                });

    d3.select("#buttonDate").on("click", function() {
                                state = ["Date"];
                                activeColorBy(this);
                                mouseOut();
                                updateLegend();
                                });

    d3.select("#buttonOrganism").on("click", function() {
                                state = ["Organism"];
                                activeColorBy(this);
                                mouseOut();
                                updateLegend();
                                });

    d3.select("#buttonTech").on("click", function() {
                                state = ["Tech"];
                                activeColorBy(this);
                                mouseOut();
                                updateLegend();
                                });

    d3.select("#buttonFilterPos").on("click", function() {
                                filter = ["PositiveOnly"];
                                d3.selectAll("circle")
                                    .attr("display", "inline")
                                    .classed("show", true);
                                d3.selectAll("circle")
                                    .filter(function (d) {return d.Positive === 0;})
                                    .attr("display", "none")
                                    .classed("show", false);
                                activeFilterBy(this);
                                update();
                                });

    d3.select("#buttonFilterNeg").on("click", function() {
                                filter = ["NegativeOnly"];
                                d3.selectAll("circle")
                                    .attr("display", "inline")
                                    .classed("show", true);
                                    d3.selectAll("circle")
                                    .filter(function (d) {return d.Positive === 1;})
                                    .attr("display", "none")
                                    .classed("show", false);
                                activeFilterBy(this);
                                update();
                                });
                
    d3.select("#buttonResetFilter").on("click", function() {
                                    filter = ["Reset"];
                                    d3.selectAll("circle")
                                        .attr("display", "inline")
                                        .classed("show", true)
                                        .classed("searched", false);
                                    if (d3.selectAll(".selected")){
                                        d3.select("#SampleDetails").classed("collapse", true);
                                        d3.select(".selected").classed("selected", false);
                                        mouseOut();
                                    }
                                    activeFilterBy(0);
                                    update();
                                    });
            
    d3.select("#nRadius").on("input", function () {
                            update();
                        });

    d3.select("#nRow").on("input", function(){
                            update();
                        });

    d3.select("#submitSearch").on("click", function (){
                                d3.selectAll("circle.searched")
                                    .classed("searched", false);
                                var position;
                                var innerHeight;
                                var searchTerm;
                                var searchInput = document.getElementById("searchField").value;
                                if (searchInput){
                                    searchInput = searchInput.trim();
                                    var sel = d3.selectAll("circle.show").filter(function (d,i){
                                                                            if (searchInput.match(/^\D[a-z\d]*\d$/i)){
                                                                                return d.Order_ID === searchInput.toUpperCase();
                                                                            }else if(searchInput.match(/\d{4}-\d{2}-\d{2}/)){
                                                                                return d.Date === searchInput;
                                                                            }else if(searchInput.match(/positive|negative/i)){
                                                                                return d.Type === searchInput[0].toUpperCase() + searchInput.slice(1).toLowerCase();
                                                                            }else{
                                                                                if (d.Organism === searchInput.toUpperCase()){
                                                                                    return d.Organism === searchInput.toUpperCase();
                                                                                }else if (d.Ward_Name.toUpperCase() === searchInput.toUpperCase()){
                                                                                    return d.Ward_Name.toUpperCase() === searchInput.toUpperCase();

                                                                                }else{
                                                                                    return d.Tech.toUpperCase() === searchInput.toUpperCase();
                                                                                }
                                                                            }
                                                                        });

                                    if (sel.empty()){
                                        d3.select("#search")
                                            .transition()
                                            .style("background-color", "#d9534f")
                                            .transition()
                                            .style("background-color", "white");
                                    }else{
                                        sel.classed("searched", true)
                                            .transition()
                                            .duration(1000)
                                            .style("fill", "purple")
                                            .call(function(){
                                                position = this[0][0].getBoundingClientRect().top;
                                                innerHeight = window.innerHeight/4; 
                                            })
                                            .tween("scroll", scroll(position-innerHeight));
                                                                              
                                        function scroll(position) {
                                            return function() {
                                                var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, position);
                                                return function(t) {scrollTo(0, i(t));};
                                            };
                                        }
                                    }

                                }else{

                                }

                                });

    d3.select("#gridTab").on("click", function(){
                                if (view[0] !== "Grid"){
                                    title = d3.select("#dateRange")
                                            .append("h4");
                                    enableButtons();
                                    d3.selectAll("svg").remove();
                                    d3.selectAll(".deleteMe").remove();
                                    d3.select("#sideBar").classed("collapse", false);
                                    d3.select("#infoTable").select("table").remove();
                                    d3.selectAll("div.d3-tip.n").remove();
                                    document.getElementById("nRadius").value = 10;
                                    document.getElementById("nRow").value = 25;
                                    view = ["Grid"];    
                                    state = ["Result"];
                                    filter = ["Reset"];
                                    sort = ["Default"];
                                    wardCount = {};
                                    organismCount = {};
                                    colorMap = {Positive:"#d95f02", Negative:"#b2df8a"};
                                    d3.select(".FilterBy").selectAll(".btn").classed("active", false);
                                    d3.select(".SortBy").selectAll(".btn").classed("active", false);
                                    d3.select(".ColorBy").selectAll(".btn").classed("active", false);
                                    main(Data);
                                }else{

                                }
    });
    
    d3.select("#chartsTab").on("click", function(){
                            if (view[0] !== "Charts"){
                                view = ["Charts"];
                                filter = ["Reset"];
                                d3.selectAll(".btn").classed("active", false);
                                d3.select("#sideBar").classed("collapse", true);
                                disableButtons();
                                d3.selectAll("svg").remove();
                                d3.select("#infoTable").select("table").remove();
                                d3.select("#dateRange").html("");

                                var margin = {top: 30, right: 20, bottom: 90, left: 50};
                                var width = (parseInt(d3.select('.chartLayout').style('width'), 10) - margin.left - margin.right);
                                var height = 500 - margin.top - margin.bottom;

                                var dailyTotal = d3.nest()
                                                    .key(function(d){return d.Date;})
                                                    .rollup(function(d){return d.length;})
                                                    .entries(Data);

                                var dailyPositive = d3.nest()
                                                    .key(function(d){return d.Date;})
                                                    .rollup(function(d){return d.length;})
                                                    .entries(Data.filter(function(d){return d.Positive === 1;}));

                                var techTotal = d3.nest()
                                                    .key(function(d){return d.Tech;})
                                                    .rollup(function(d){return d.length;})
                                                    .entries(Data);

                                var techPositiveTotal = d3.nest()
                                                    .key(function(d){return d.Tech;})
                                                    .rollup(function(d){return d.length;})
                                                    .entries(Data.filter(function(d){return d.Positive === 1;}));

                                dailyTotal.forEach(function(d){
                                        d.key = parseDate(d.key);
                                        d.values = +d.values;
                                });

                                dailyPositive.forEach(function(d){
                                        d.key = parseDate(d.key);
                                        d.values = +d.values;
                                });

                                techTotal.forEach(function(d){
                                        d.values = +d.values;
                                });

                                techPositiveTotal.forEach(function(d){
                                        d.values = +d.values;
                                });

                                var dailyTotalAverage = d3.mean(dailyTotal, function(d) {return d.values;});
                                var dailyPositiveAverage = d3.mean(dailyPositive, function(d) {return d.values;});

                                var dailyTotalSum = d3.sum(dailyTotal, function(d) {return d.values;});
                                var dailyPositiveSum = d3.sum(dailyPositive, function(d) {return d.values;});

                                var dailyPercentage = [];

                                dailyTotal.sort(function(a,b){return d3.ascending(a.key, b.key)});
                                dailyPositive.sort(function(a,b){return d3.ascending(a.key, b.key)});

                                for (var t = 0, i = 0; t < dailyTotal.length; t++, i++){
                                	if (i < dailyPositive.length){
	                                    if (dailyTotal[t].key.getTime() === dailyPositive[i].key.getTime()){
	                                        dailyPercentage[t] = {"key":" ", "values":" "};
	                                        dailyPercentage[t].key = dailyTotal[t].key; 
	                                        dailyPercentage[t].values = (dailyPositive[i].values/dailyTotal[t].values)*100;
	                                    }else{
	                                        dailyPercentage[t] = {"key":" ", "values":" "};
	                                        dailyPercentage[t].key = dailyTotal[t].key; 
	                                        dailyPercentage[t].values = 0;
	                                        i = i - 1;
	                                    }
	                                }else{
	                                        dailyPercentage[t] = {"key":" ", "values":" "};
	                                        dailyPercentage[t].key = dailyTotal[t].key; 
	                                        dailyPercentage[t].values = 0;
	                                }
                                }

                                var techPercentageList = [];
                                
                                techTotal.forEach(function(d){
                                        var techPercentage = {};
                                        var z = 0;
                                        for (var i = 0; i < techPositiveTotal.length; i++){
                                            if(techPositiveTotal[i].key === d.key){
                                                techPercentage["Tech"] = d.key;
                                                techPercentage["Percent"] = (techPositiveTotal[i].values/d.values)*100;
                                                techPercentage["Positive"] = techPositiveTotal[i].values;
                                                techPercentage["Total"] = d.values;
                                                z=1;
                                            }else{

                                            }
                                        }
                                        if (z === 0){
                                                techPercentage["Tech"] = d.key;
                                                techPercentage["Percent"] = 0;
                                                techPercentage["Positive"] = 0;
                                                techPercentage["Total"] = d.values;
                                        }else{

                                        }
                                        techPercentageList.push(techPercentage);
                                });

                                function makeBarChart(input){
                                    if (input === 0){
                                        var meanLine = dailyTotalAverage;
                                        var chartData = dailyTotal;
                                        var yLabel = "Daily Total";
                                        var chartTitle = "Total Parasitology Samples Per Day";

                                    }else if (input === 1){
                                        var meanLine = dailyPositiveAverage;
                                        var chartData = dailyPositive;
                                        var yLabel = "Daily Positive";
                                        var chartTitle = "Total Positive Samples Per Day";
                                    }else{

                                    }

                                    var xScale = d3.scale.ordinal()
                                                .domain(dailyTotal.map(function(d){return d.key;}))
                                                .rangeRoundBands([0, width], 0.15);

                                    var yScale = d3.scale.linear()
                                                    .domain(d3.extent(chartData, function(d) {return d.values;}))
                                                    .range([height, 0]);

                                    
                                    var xAxis = d3.svg.axis()
                                                        .scale(xScale)
                                                        //.tickValues(xScale.domain().filter(function(d, i) { return !(i % 2); }))
                                                        .orient("bottom")
                                                        .tickFormat(d3.time.format("%b %e, %Y"));

                                    var yAxis = d3.svg.axis()
                                                        .scale(yScale)
                                                        .orient("left");

                                    var svg = d3.select(".chartLayout").append("svg")
                                                .attr("width", width + margin.left + margin.right)
                                                .attr("height", height + margin.top + margin.bottom)
                                                .append("g")
                                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                                    svg.append("g")
                                            .attr("class", "x axis")
                                            .attr("transform", "translate(0," + height + ")")
                                            .call(xAxis)
                                            .selectAll("text")  
                                            .style("text-anchor", "end")
                                            .attr("dx", "-.8em")
                                            .attr("dy", ".15em")
                                            .attr("transform", "rotate(-65)" );

                                    svg.append("g")
                                      .attr("class", "y axis")
                                      .call(yAxis);
                                      /*.append("text")
                                      .attr("transform", "rotate(-90)")
                                      .attr("y", 6)
                                      .attr("dy", ".71em")
                                      .style("text-anchor", "end")
                                      .text("Daily Total");*/

                                    svg.selectAll(".bar")
                                          .data(chartData)
                                          .enter()
                                          .append("rect")
                                          .attr("class", "bar")
                                          .attr("x", function(d) {return xScale(d.key);})
                                          .attr("width", xScale.rangeBand())
                                          .attr("y", function(d) {return height;})
                                          .attr("height", function(d) {return 0;})
                                          .transition()
                                          .duration(500)
                                          .attr("y", function(d) {return yScale(d.values);})
                                          .attr("height", function(d) {return height - yScale(d.values);});

                                    svg.append("text")
                                        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
                                        .style("text-anchor", "middle")
                                        .text("Date");

                                    svg.append("text")
                                        .attr("transform", "rotate(-90)")
                                        .attr("y", 0 - margin.left)
                                        .attr("x",0 - (height / 2))
                                        .attr("dy", "1em")
                                        .style("text-anchor", "middle")
                                        .text(yLabel);

                                    svg.append("line")
                                        .attr("class", "averageLine")
                                        .attr("x1",0)
                                        .attr("y1",yScale(meanLine))
                                        .attr("x2",width)
                                        .attr("y2",yScale(meanLine))
                                        .style("stroke", "#d9534f")
                                        .style("stroke-width", "2");

                                    /*svg.append("text")
                                        .attr("transform", "translate(" + (width) + " ," + (yScale(dailyAverage)) + ")")
                                        .style("text-anchor", "end")
                                        .attr("dy", "-0.25em")
                                        .attr("dx", "-.3em")
                                        .text("Average")
                                        .style("font", "10px sans-serif")
                                        .style("fill", "#d9534f")
                                        .style("font-weight", "bold");*/

                                    svg.append("text")
                                          .attr("class", "title")
                                          .attr("x", width/2)
                                          .attr("y", 0 - (margin.top / 2))
                                          .attr("text-anchor", "middle")
                                          .text(chartTitle)
                                          .style("font-size", "16px")
                                          .style("font-weight", "bold");

                                    d3.select(".chartLayout")
                                        .append("div")
                                        .attr("class", "deleteMe")
                                        .html("<br><br><br>");

                                }

                                function makeLineChart(){

                                    var xScale = d3.scale.ordinal()
                                                .domain(dailyPercentage.map(function(d){return d.key;}))
                                                .rangeRoundBands([0, width], 0.15);

                                    var yScale = d3.scale.linear()
                                                    .domain(d3.extent(dailyPercentage, function(d) {return d.values;}))
                                                    .range([height, 0]);

                                    
                                    var xAxis = d3.svg.axis()
                                                        .scale(xScale)
                                                        //.tickValues(xScale.domain().filter(function(d, i) { return !(i % 2); }))
                                                        .orient("bottom")
                                                        .tickFormat(d3.time.format("%b %e, %Y"));

                                    var yAxis = d3.svg.axis()
                                                        .scale(yScale)
                                                        .orient("left");

                                    var svg = d3.select(".chartLayout").append("svg")
                                                .attr("width", width + margin.left + margin.right)
                                                .attr("height", height + margin.top + margin.bottom)
                                                .append("g")
                                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                                    svg.append("g")
                                            .attr("class", "x axis")
                                            .attr("transform", "translate(0," + height + ")")
                                            .call(xAxis)
                                            .selectAll("text")  
                                            .style("text-anchor", "end")
                                            .attr("dx", "-.8em")
                                            .attr("dy", ".15em")
                                            .attr("transform", "rotate(-65)" );

                                    svg.append("g")
                                      .attr("class", "y axis")
                                      .call(yAxis);
                                      /*.append("text")
                                      .attr("transform", "rotate(-90)")
                                      .attr("y", 6)
                                      .attr("dy", ".71em")
                                      .style("text-anchor", "end")
                                      .text("Daily Total");*/

                                    svg.selectAll("line.horizontalGrid")
                                        .data(yScale.ticks(10)).enter()
                                        .append("line")
                                        .attr(
                                        {
                                            "class":"horizontalGrid",
                                            "x1" : 0,
                                            "x2" : width,
                                            "y1" : function(d){ return yScale(d);},
                                            "y2" : function(d){ return yScale(d);},
                                            "fill" : "none",
                                            "shape-rendering" : "crispEdges",
                                            "stroke" : "#bdbdbd",
                                            "stroke-width" : "1px",
                                            "opacity": "0.7"
                                        });

                                    var line = d3.svg.line()
                                            .x(function(d) {return xScale(d.key);})
                                            .y(function(d) {return yScale(d.values);});

                                    var tickDiff = +(xScale(dailyPercentage[0].key));

                                    svg.append("path")
                                        .datum(dailyPercentage)
                                        .attr("class", "line")
                                        .attr("transform", "translate(" + tickDiff + "," + 0 + ")")
                                        .attr("d", line);

                                    svg.append("text")
                                        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
                                        .style("text-anchor", "middle")
                                        .text("Date");

                                    svg.append("text")
                                        .attr("transform", "rotate(-90)")
                                        .attr("y", 0 - margin.left)
                                        .attr("x",0 - (height / 2))
                                        .attr("dy", "1em")
                                        .style("text-anchor", "middle")
                                        .text("Percent (%)");

                                    svg.append("text")
                                          .attr("class", "title")
                                          .attr("x", width/2)
                                          .attr("y", 0 - (margin.top / 2))
                                          .attr("text-anchor", "middle")
                                          .text("Daily Percent Positive")
                                          .style("font-size", "16px")
                                          .style("font-weight", "bold");

                                    d3.select(".chartLayout")
                                        .append("div")
                                        .attr("class", "deleteMe")
                                        .html("<br><br><br>");

                                    svg.append("line")
                                        .attr("class", "averageLine")
                                        .attr("x1",0)
                                        .attr("y1",yScale((dailyPositiveSum/dailyTotalSum)*100))
                                        .attr("x2",width)
                                        .attr("y2",yScale((dailyPositiveSum/dailyTotalSum)*100))
                                        .style("stroke", "black")
                                        .style("stroke-width", "2");

                                }

                                function makeHorizontalBarChart(){

                                    var orgCount = organismCount;
                                    delete orgCount["NONE"];
                                    var margin = {top: 30, right: 20, bottom: 90, left: 220};
                                    var width = (parseInt(d3.select('.chartLayout').style('width'), 10) - margin.left - margin.right);
                                    var height = ((800/Object.keys(orgCount).length)*Object.keys(orgCount).length) - margin.top - margin.bottom;

                                    var xScale = d3.scale.log()
                                                    .domain(d3.extent(Object.keys(orgCount).map(function(d){return organismCount[d];})))
                                                    .range([0, width]);

                                    var yScale = d3.scale.ordinal()
                                                    .domain(Object.keys(orgCount).sort(function(a,b){return orgCount[a]-orgCount[b]}))
                                                    .rangeRoundBands([height, 0], 0.15);

                                    
                                    var xAxis = d3.svg.axis()
                                                        .scale(xScale)
                                                        //.tickValues(xScale.domain().filter(function(d, i) { return !(i % 2); }))
                                                        .orient("bottom")
                                                        .tickFormat(function(d){return d;});

                                    var yAxis = d3.svg.axis()
                                                        .scale(yScale)
                                                        .orient("left");

                                    var svg = d3.select(".chartLayout").append("svg")
                                                .attr("width", width + margin.left + margin.right)
                                                .attr("height", height + margin.top + margin.bottom)
                                                .append("g")
                                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                                    svg.append("g")
                                            .attr("class", "x axis")
                                            .attr("transform", "translate(0," + height + ")")
                                            .call(xAxis)
                                            .selectAll("text")  
                                            .style("text-anchor", "middle");

                                    svg.append("g")
                                      .attr("class", "y axis")
                                      .call(yAxis);

                                    svg.selectAll(".bar")
                                          .data(Object.keys(orgCount))
                                          .enter()
                                          .append("rect")
                                          .attr("class", "bar")
                                          .attr("x", function(d) {return 0;})
                                          .attr("height", yScale.rangeBand())
                                          .attr("y", function(d) {return yScale(d);})
                                          .attr("width", function(d) {return xScale(orgCount[d]);});

                                    svg.selectAll("line.verticalGrid")
                                        .data(xScale.ticks(10)).enter()
                                        .append("line")
                                        .attr(
                                        {
                                            "class":"verticalGrid",
                                            "x1" : function(d){ return xScale(d);},
                                            "x2" : function(d){ return xScale(d);},
                                            "y1" : 0,
                                            "y2" : height,
                                            "fill" : "none",
                                            "shape-rendering" : "crispEdges",
                                            "stroke" : "white",
                                            "stroke-width" : "1px",
                                            "opacity": "0.7"
                                        });

                                    svg.append("text")
                                        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom/2) + ")")
                                        .style("text-anchor", "middle")
                                        .text("Number of Samples");

                                    svg.append("text")
                                        .attr("transform", "rotate(-90)")
                                        .attr("y", 0 - margin.left)
                                        .attr("x",0 - (height / 2))
                                        .attr("dy", "1em")
                                        .style("text-anchor", "middle")
                                        .text("Organism");

                                    svg.append("text")
                                          .attr("class", "title")
                                          .attr("x", width/2)
                                          .attr("y", 0 - (margin.top / 2))
                                          .attr("text-anchor", "middle")
                                          .text("Organism Number")
                                          .style("font-size", "16px")
                                          .style("font-weight", "bold");

                                    d3.select(".chartLayout")
                                        .append("div")
                                        .attr("class", "deleteMe")
                                        .html("<br><br><br>");

                                }

                                function makeLevelChart(){

                                    techPercentageList = techPercentageList.filter(function(d){return +d.Total > 40;});
                                    var margin = {top: 30, right: 35, bottom: 90, left: 100};
                                    var width = (parseInt(d3.select('.chartLayout').style('width'), 10) - margin.left - margin.right);
                                    var height = 900 - margin.top - margin.bottom;

                                    var xScale = d3.scale.linear()
                                                    .domain(d3.extent(techPercentageList, function(d) {return +d.Total;}))
                                                    .range([0, width]);

                                    var yScale = d3.scale.linear()
                                                    .domain(d3.extent(techPercentageList, function(d) {return +d.Percent;}))
                                                    .range([height, 0]);

                                    var lineColorScale = d3.scale.linear()
                                                            .domain(d3.extent(techPercentageList, function(d) {return +d.Percent;}))
                                                            .range(["black", "gray", "white"]);
                                    
                                    var xAxis = d3.svg.axis()
                                                        .scale(xScale)
                                                        //.tickValues(xScale.domain().filter(function(d, i) { return !(i % 2); }))
                                                        .orient("bottom");
                                                       
                                    var yAxis = d3.svg.axis()
                                                        .scale(yScale)
                                                        .orient("left");

                                    var svg = d3.select(".chartLayout").append("svg")
                                                .attr("width", width + margin.left + margin.right)
                                                .attr("height", height + margin.top + margin.bottom)
                                                .append("g")
                                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                                    svg.append("g")
                                            .attr("class", "x axis")
                                            .attr("transform", "translate(0," + (height + 10 )+ ")")
                                            .call(xAxis)
                                            .selectAll("text")  
                                            .style("text-anchor", "end")
                                            .attr("dx", "-.8em")
                                            .attr("dy", ".15em")
                                            .attr("transform", "rotate(-65)" );

                                    svg.append("g")
                                      .attr("class", "y axis")
                                      .attr("transform", "translate(" + (-25) + ",0)")
                                      .call(yAxis);

                                    svg.selectAll("line.horizontalTechYGrid")
                                        .data(techPercentageList).enter()
                                        .append("line")
                                        .attr(
                                        {
                                            "class":"horizontalTechYGrid",
                                            "x1" : -25,
                                            "x2" : function(d){return xScale(+d.Total);},
                                            "y1" : function(d){return yScale(+d.Percent);},
                                            "y2" : function(d){return yScale(+d.Percent);},
                                            "fill" : "none",
                                            "shape-rendering" : "crispEdges",
                                            "stroke" : "#bdbdbd",
                                            "stroke-width" : "1px",
                                            "opacity": "0.7"
                                        });

                                    svg.selectAll("line.horizontalTechXGrid")
                                        .data(techPercentageList).enter()
                                        .append("line")
                                        .attr(
                                        {
                                            "class":"horizontalTechXGrid",
                                            "x1" : function(d){return xScale(+d.Total);},
                                            "x2" : function(d){return xScale(+d.Total);},
                                            "y1" : (height+10),
                                            "y2" : function(d){return yScale(+d.Percent);},
                                            "fill" : "none",
                                            "shape-rendering" : "crispEdges",
                                            "stroke" : "#bdbdbd",
                                            "stroke-width" : "1px",
                                            "opacity": "0.7"
                                        });

                                    var techText = svg.append("g")
                                                        .attr("class", "techText")
                                                        .selectAll("text")
                                                        .data(techPercentageList)
                                                        .enter()
                                                        .append("text")
                                                        .attr("y", function(d){return yScale(+d.Percent);})
                                                        .attr("x", function(d){return xScale(+d.Total);})
                                                        .attr("text-anchor", "middle")
                                                        .style("font-weight", "bold")
                                                        .text(function(d){return d.Tech;});

                                    svg.append("text")
                                        .attr("transform", "rotate(-90)")
                                        .attr("y", 0 - margin.left)
                                        .attr("x",0 - (height / 2))
                                        .attr("dy", "1em")
                                        .style("text-anchor", "middle")
                                        .text("Percent (%)");

                                    svg.append("text")
                                        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 15) + ")")
                                        .style("text-anchor", "middle")
                                        .text("Total Resulted");

                                    svg.append("text")
                                          .attr("class", "title")
                                          .attr("x", width/2)
                                          .attr("y", 0 - (margin.top / 2))
                                          .attr("text-anchor", "middle")
                                          .text("Technician Percent Versus Total Resulted")
                                          .style("font-size", "16px")
                                          .style("font-weight", "bold");

                                    d3.select(".chartLayout")
                                        .append("div")
                                        .attr("class", "deleteMe")
                                        .html("<br><br><br>");

                                }

                                makeBarChart(0);
                                makeBarChart(1);
                                makeLineChart();
                                makeLevelChart();
                                makeHorizontalBarChart();

                            }else{

                            }

    });

    d3.select("#tableTab").on("click", function(){
                        if (view[0] !== "Table"){
                            filter = ["Reset"];
                            d3.selectAll(".btn").classed("active", false);
                            d3.select("#sideBar").classed("collapse", false);
                            view = ["Table"];
                            disableButtons();
                            d3.selectAll("svg").remove();
                            d3.selectAll(".deleteMe").remove();
                            d3.select("#dateRange").html("");

                            var table = d3.select("body").select("#infoTable")
                                                        .append("table")
                                                        .attr("class", "table table-hover");
                            var tableHead = table.append("thead")
                                                    .append("tr");
                            var tabelHeadLabels = tableHead.html(function(){return "<th class='text-center'>Order ID</th><th class='text-center'>Date</th><th class='text-center'>Ward Name</th><th class='text-center'>Result</th><th class='text-center'>Organism</th><th class='text-center'>Tech</th>";});
                            var tableBody = table.append("tbody");
                            var tableBodyContainer = tableBody.selectAll("tr")
                                                            .data(Data)
                                                            .enter()
                                                            .append("tr");
                            tableBodyContainer.append("td")
                                            .text(function(d){return d.Order_ID;})
                                            .attr("class", "text-center");
                            tableBodyContainer.append("td")
                                            .text(function(d){return formatTimeSmall(parseDate(d.Date));})
                                            .attr("class", "text-center");
                            tableBodyContainer.append("td")
                                            .text(function(d){return d.Ward_Name;})
                                            .attr("class", "text-center");
                            tableBodyContainer.append("td")
                                            .text(function(d){return d.Type;})
                                            .attr("class", "text-center");
                            tableBodyContainer.append("td")
                                            .text(function(d){return d.Organism;})
                                            .attr("class", "text-center");
                            tableBodyContainer.append("td")
                                            .text(function(d){return d.Tech;})
                                            .attr("class", "text-center");
                        }else{

                        }

    });

}

d3.select("#upload").on("change", function () {

                                    if (view[0] !== "Grid"){
                                        view = ["Grid"];
                                        title = d3.select("#dateRange")
                                                    .append("h4");
                                        enableButtons();
                                        d3.selectAll("svg").remove();
                                        d3.select("#infoTable").select("table").remove();
                                        d3.selectAll(".deleteMe").remove();
                                        d3.select("#sideBar").classed("collapse", false);
                                    }

                                    if (window.File && window.FileReader && window.FileList && window.Blob) {
                                        var uploadFile = this.files[0];
                                        var filereader = new window.FileReader();

                                        filereader.onload = function(){
                                          var txtRes = filereader.result;

                                        try{
                                            defaultData = 0;
                                            d3.selectAll("svg").remove();
                                            d3.selectAll("div.d3-tip.n").remove();
                                            document.getElementById("nRadius").value = 10;
                                            document.getElementById("nRow").value = 25;    
                                            state = ["Result"];
                                            filter = ["Reset"];
                                            sort = ["Default"];
                                            wardCount = {};
                                            organismCount = {};
                                            techCount = {};
                                            colorMap = {Positive:"#d95f02", Negative:"#b2df8a"};
                                            d3.select(".FilterBy").selectAll(".btn").classed("active", false);
                                            d3.select(".SortBy").selectAll(".btn").classed("active", false);
                                            d3.select(".ColorBy").selectAll(".btn").classed("active", false);
                                            Data = JSON.parse(txtRes);
                                            main(Data); 
                                        }catch(err){
                                            window.alert("Error Parsing Uploaded File:\n\n"  + '"' + err.message + '"');
                                            return;
                                        }
                                        };

                                        filereader.readAsText(uploadFile);
                                        
                                    }else {
                                        alert("Upload not supported.");
                                    }

                        });

if (defaultData === 1){
    d3.json("datamonth.json", function(error, Data) {main(Data);});
}else{

}







   