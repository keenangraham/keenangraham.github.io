
        
           d3.json("Data/datatest.json", function(error, Data) {
            var state = ["Result"];
            var filter = ["Reset"];
            var radiusSet = 15;       
            var spr = 20;
            var rowsNeeded = Math.ceil(Data.length/spr);
            var width = spr*41;
            var dpr = width/radiusSet;
            var height = rowsNeeded*38;
            var dataLength = d3.range(1, Data.length + 1);

            var x = 0;
            var y = 0;

            function countery() {
                y++;

            }

            function counterx() {
                x++;

            }

            var parseDate = d3.time.format("%Y-%m-%d").parse;

            var formatTime = d3.time.format("%B %e, %Y");
            var dateFn = function(d) { return formatTime(parseDate(d.Date))};

            var dateRangefirst = d3.min(Data, dateFn);
            var dateRangelast = d3.max(Data, dateFn);

            var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-20, 0])
                        .html(function(d) {
                            if (d.Positive === 1) {
                                return  "<strong>Order:</strong> <span style='color:#d95f02'>" + d.Order_ID  + "</span><br>" +
                                        "<strong>Date:</strong> <span style='color:#d95f02'>" + formatTime(parseDate(d.Date)) + "</span><br>" +
                                        "<strong>Ward Name:</strong> <span style='color:#d95f02'>" + d.Ward_Name + "</span><br>"+
                                        "<strong>Result:</strong> <span style='color:#d95f02'>" + d.Type + "</span><br>" +
                                        "<strong>Organism(s):</strong> <span style='color:#d95f02'>" + d.Organism + "</span>";
                            } else {
                                return  "<strong>Order:</strong> <span style='color:#b2df8a'>" + d.Order_ID  + "</span><br>" +
                                        "<strong>Date:</strong> <span style='color:#b2df8a'>" + formatTime(parseDate(d.Date)) + "</span><br>" +
                                        "<strong>Ward Name:</strong> <span style='color:#b2df8a'>" + d.Ward_Name + "</span><br>"+
                                        "<strong>Result:</strong> <span style='color:#b2df8a'>" + d.Type + "</span>";
                            }
                        });


        /*    var div = d3.select("body").append("div")   
                        .attr("class", "tooltip")               
                        .style("opacity", 0); */

            var color = d3.scale.category20(); 
             var title = d3.select("#dateRange")
                    .append("svg")
                    .attr("width", 600)
                    .attr("height", 40)
                    .append("text")
                    .attr("class", "title")
                    .attr("dy", "1.4em")
                    .attr("font-size", "18px")
                    .text("Date Range: " + dateRangefirst + " - " + dateRangelast);

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
                                .attr("cx", function(d,i) {
                                if (i % spr === 0 && i != 0) {
                                    counterx()
                                    return ((i - (x*spr))* 40);
                                } else {
                                    return ((i - (x*spr))* 40);
                                }})
                                .attr("cy", function(d,i) { 
                                if (i % spr === 0 && i != 0) { 
                                    countery()
                                    return (y/2.7*100) + 100; 
                                } else { 
                                    return (y/2.7*100) + 100;
                                }})
                                .attr("r", 15)
                                .attr("stroke", "black")
                                .attr("stroke-width", 2)
                                .style("fill", function(d) { 
                                if (d.Positive === 1) { 
                                    return "#d95f02"; 
                                } else {
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
                                     d3.select(".collapse")
                                    .classed("collapse", false);

                                    d3.select(".selected").classed("selected", false);
                                    d3.select(this).classed("selected", true)
                                    .style({fill:"black"});

                                    mouseOut();

          
                                    d3.select("#Order").text(d.Order_ID)
                                    d3.select("#Date").text(d.Date)
                                    d3.select("#Ward").text(d.Ward_Name)
                                    d3.select("#Result").text(d.Type)
                                    d3.select("#Organism").text(d.Organism);

                                    });

function mouseOut() {
    d3.selectAll("circle:not(.selected)")
        .style({fill: function(d) { 
                    if (state[0]=== "Result"){
                            if (d.Positive === 1) { 
                                return "#d95f02"; 
                            } else {
                                return "#b2df8a";
                                            }
                    }else if (state[0]=== "Ward"){
                            return color(d.Ward_Name);
                    }else if (state[0]=== "Ward"){
                            return color(d.Ward_Name);
                    }else if (state[0]=== "Date"){
                            return color(d.Date);
                    }else if (state[0]=== "Organism"){
                            return color(d.Organism);
                    }
            }});
}

                 d3.select("#buttonResult").on("click", function() {
                        state = ["Result"];
                        d3.selectAll("circle")
                        .transition()
                        .duration(500)
                        .style("fill", function(d) { 
                                if (d.Positive === 1) { 
                                    return "#d95f02"; 
                                } else {
                                    return "#b2df8a";
                                }})

                });

                d3.select("#buttonWard").on("click", function() {
                        state = ["Ward"];
                        d3.selectAll("circle")
                        .transition()
                        .duration(500)
                        .style("fill", function(d) {
                            return color(d.Ward_Name);
                        })

                });

                d3.select("#buttonDate").on("click", function() {
                        state = ["Date"];
                        d3.selectAll("circle")
                        .transition()
                        .duration(500)
                        .style("fill", function(d) {
                            return color(d.Date);
                        })


                });

                d3.select("#buttonOrganism").on("click", function() {
                        state = ["Organism"];
                        d3.selectAll("circle")
                        .transition()
                        .duration(500)
                        .style("fill", function(d) {
                            return color(d.Organism);
                        })


                });

                 d3.select("#buttonFilterPos").on("click", function() {
                        filter = ["PositiveOnly"];
                        d3.selectAll("circle").filter(function (d) {return d.Positive === 0;})
                        .attr("display", "inline");
                        d3.selectAll("circle").filter(function (d) {return d.Positive === 1;})
                        .attr("display", "inline")
                        x=0;
                        y=0;
                        var nRadius = +document.getElementById("nRadius").value;
                        var nRow = +document.getElementById("nRow").value;      
                        var spr = nRow;
                        var datalength = Data.filter(function (d) { return d.Positive === 1;}).length;
                        
                        d3.selectAll("circle")
                            .transition()
                            .duration(300)
                            .filter(function (d) {return d.Positive === 1;})
                            .attr("r", (nRadius+(nRadius*0.30)))
                            .transition()
                            .duration(500)
                            .attr("r", nRadius)
                            .attr("cx", function(d,i) {
                                if (i % spr === 0 && i != 0) {
                                    counterx()
                                    return ((i - (x*spr))* 40 / (15/nRadius));
                                } else {
                                    return ((i - (x*spr))* 40/ (15/nRadius));
                                }})
                                .attr("cy", function(d,i) { 
                                if (i % spr === 0 && i != 0) { 
                                    countery()
                                    return (y/(2.7*(15/nRadius))*100) + 100; 
                                } else { 
                                    return (y/(2.7*(15/nRadius))*100) + 100;
                                }});
                            

                            d3.selectAll("circle").filter(function (d) {return d.Positive === 0;})
                            .attr("display", "none").call(update());

                        });

                d3.select("#buttonFilterNeg").on("click", function() {
                        filter = ["NegativeOnly"];
                        d3.selectAll("circle").filter(function (d) {return d.Positive === 0;})
                        .attr("display", "inline");
                        d3.selectAll("circle").filter(function (d) {return d.Positive === 1;})
                        .attr("display", "inline")
                        x=0;
                        y=0;
                        var nRadius = +document.getElementById("nRadius").value;
                        var nRow = +document.getElementById("nRow").value;      
                        var spr = nRow;
                        var datalength = Data.filter(function (d) { return d.Positive === 0;}).length;
                        
                        d3.selectAll("circle")
                            .transition()
                            .duration(300)
                            .filter(function (d) {return d.Positive === 0;})
                            .attr("r", (nRadius+(nRadius*0.30)))
                            .transition()
                            .duration(500)
                            .attr("r", nRadius)
                            .attr("cx", function(d,i) {
                                if (i % spr === 0 && i != 0) {
                                    counterx()
                                    return ((i - (x*spr))* 40 / (15/nRadius));
                                } else {
                                    return ((i - (x*spr))* 40/ (15/nRadius));
                                }})
                                .attr("cy", function(d,i) { 
                                if (i % spr === 0 && i != 0) { 
                                    countery()
                                    return (y/(2.7*(15/nRadius))*100) + 100; 
                                } else { 
                                    return (y/(2.7*(15/nRadius))*100) + 100;
                                }});
                            

                            d3.selectAll("circle").filter(function (d) {return d.Positive === 1;})
                            .attr("display", "none").call(update());

                        });
                

                  


                d3.select("#buttonResetFilter").on("click", function() {
                        filter = ["Reset"];
                        d3.selectAll("circle").filter(function (d) {return d.Positive === 0;})
                        .attr("display", "inline");
                        d3.selectAll("circle").filter(function (d) {return d.Positive === 1;})
                        .attr("display", "inline")
                        update();
                    });
            


                d3.select("#nRadius").on("input", function () {
                    update();

                });


                d3.select("#nRow").on("input", function(){
                    update();
               });


                update();

                function update() { 

                    if (filter[0] === "PositiveOnly"){
                        var datalength = Data.filter(function (d) { return d.Positive === 1;}).length;
                    }else if (filter[0] === "NegativeOnly"){
                        var datalength = Data.filter(function (d) { return d.Positive === 0;}).length;
                    }else{
                        var datalength = Data.length;
                    }

                    var margin = {top: 20, right: 20, bottom: 20, left: 20};
                    var heightRange = d3.scale.linear().domain([5, 15]).range([-92.5,-74]);
                    var widthRange = d3.scale.linear().domain([5, 15]).range([8,26]);
                    var nRadius = +document.getElementById("nRadius").value;
                    var nRow = +document.getElementById("nRow").value;
                    var radiusSet = nRadius;       
                    var spr = nRow;

                    var AdjHeight = d3.scale.linear().domain([10, 50]).range([0,0.15]);
                    var AdjWidth = d3.scale.linear().domain([10, 20]).range([-0.05, getValue(nRow)]);

                    var rowsNeeded = Math.ceil(datalength/spr);
                    var width = (spr*(radiusSet*(2.72-AdjWidth(nRow)))) - margin.left - margin.right;
                    var dpr = width/radiusSet;
                    var height = rowsNeeded*(radiusSet*(2.5+AdjHeight(nRow)))- margin.top - margin.bottom;
                    var dpc = height/rowsNeeded;

                    function getValue(nRow){
                        if (nRow >=43){
                            return -0.029;
                        } else if (nRow <=18){
                            return -0.029;
                        }else if ((nRow >= 25 && nRow <=31)){
                            return -0.019;
                        }else if ((nRow >= 32 && nRow <=37)){
                            return -0.023;
                        }else if ((nRow >= 38 && nRow <=42)){
                            return -0.026;
                        }else{
                            return -0.01;
                        }
                    };

                    d3.select("#nRadius").property("value", nRadius);
                    d3.select("nRow").property("value", nRow);
                    d3.select("#nRadius-value").text(nRadius);
                    d3.select("#nRow-value").text(nRow);

                    x = 0;
                    y = 0;

                     if (filter[0] === "PositiveOnly"){
                            samplesAttr
                            .filter(function (d) {return d.Positive === 1;})
                            .attr("r", nRadius)
                            .attr("cx", function(d,i) {
                                if (i % spr === 0 && i != 0) {
                                    counterx()
                                    return ((i - (x*spr))* 40 / (15/nRadius));
                                } else {
                                    return ((i - (x*spr))* 40/ (15/nRadius));
                                }})
                                .attr("cy", function(d,i) { 
                                if (i % spr === 0 && i != 0) { 
                                    countery()
                                    return (y/(2.7*(15/nRadius))*100) + 100; 
                                } else { 
                                    return (y/(2.7*(15/nRadius))*100) + 100;
                                }});
                        canvas.attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom +10);
                        group.attr("transform", "translate("+ widthRange(nRadius) +", " + heightRange(nRadius) +")");

                    }else if (filter[0] === "NegativeOnly"){
                            samplesAttr
                            .filter(function (d) {return d.Positive === 0;})
                            .attr("r", nRadius)
                            .attr("cx", function(d,i) {
                                if (i % spr === 0 && i != 0) {
                                    counterx()
                                    return ((i - (x*spr))* 40 / (15/nRadius));
                                } else {
                                    return ((i - (x*spr))* 40/ (15/nRadius));
                                }})
                                .attr("cy", function(d,i) { 
                                if (i % spr === 0 && i != 0) { 
                                    countery()
                                    return (y/(2.7*(15/nRadius))*100) + 100; 
                                } else { 
                                    return (y/(2.7*(15/nRadius))*100) + 100;
                                }});
                        canvas.attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom );
                        group.attr("transform", "translate("+ widthRange(nRadius) +", " + heightRange(nRadius) +")");

                    }else{
                
                    samplesAttr.attr("r", nRadius)
                    .attr("cx", function(d,i) {
                                if (i % spr === 0 && i != 0) {
                                    counterx()
                                    return ((i - (x*spr))* 40 / (15/nRadius));
                                } else {
                                    return ((i - (x*spr))* 40/ (15/nRadius));
                                }})
                                .attr("cy", function(d,i) { 
                                if (i % spr === 0 && i != 0) { 
                                    countery()
                                    return (y/(2.7*(15/nRadius))*100) + 100; 
                                } else { 
                                    return (y/(2.7*(15/nRadius))*100) + 100;
                                }});
                    canvas.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);
                    group.attr("transform", "translate("+ widthRange(nRadius) +", " + heightRange(nRadius) +")");

                    }
                
                }

                
                   
               


                                
/*                                .on("mouseover", function(d) {      
                                                div.transition()        
                                                    .duration(50)      
                                                    .style("opacity", .9);      
                                                div.html(formatTime(parseDate(d.Date)) + "<br>" + d.Order_ID + "<br>" + d.Type)  
                                                    .style("left", (d3.event.pageX - 25) + "px")     
                                                    .style("top", (d3.event.pageY + 20) + "px");    
                                })                  
                                .on("mouseout", function(d) {       
                                                div.transition()        
                                                .duration(500)      
                                                .style("opacity", 0);   
                                });

*/                            

});

   
