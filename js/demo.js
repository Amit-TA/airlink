/**
 * Created by amit on 9/8/16.
 */

$(function () {
    var climate="Hot";
    var household = "House A";
    var temperature = "76";
    var colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
        '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];
    $('#climate button').click(function() {
        $('#climate button').find("span").removeClass("glyphicon-ok");
        $(this).find("span").addClass("glyphicon-ok");
        climate = $(this).val()
        // TODO: insert whatever you want to do with $(this) here
    });
    $('#temparature button').click(function() {
        $('#temparature button').find("span").removeClass("glyphicon-ok");
        $(this).find("span").addClass("glyphicon-ok");
        temperature = $(this).val()
    });

    $('#consHouses button').click(function() {
        $('#consHouses button').find("span").removeClass("glyphicon-ok");
        $(this).find("span").addClass("glyphicon-ok");
        household = $(this).val()
        // TODO: insert whatever you want to do with $(this) here
    });

    $('#consClimate button').click(function() {
        $('#consClimate button').find("span").removeClass("glyphicon-ok");
        $(this).find("span").addClass("glyphicon-ok");
        climate = $(this).val()
        // TODO: insert whatever you want to do with $(this) here
    });
    $('#consTemparature button').click(function() {
        $('#consTemparature button').find("span").removeClass("glyphicon-ok");
        $(this).find("span").addClass("glyphicon-ok");
        temperature = $(this).val()
    });

    $('#distributor').click(function() {
        $('#filters').show();
        $("#mainPage").hide();
        return false;
    });
    $('#consumers').click(function() {
        $('#consumerfilters').show();
        $("#mainPage").hide();
        return false;
    });

    $('a.homeMenu').click(function() {
        $('#filters').hide();
        $('#consumerfilters').hide();
        $("#consumerContent").hide();
        $("#distributorContent").hide();
        $("#mainPage").show();
        return false;
    });
    $('#consFiltersShortCut').click(function() {
        $('#filters').hide();
        $("#mainPage").hide();
        $("#distributorContent").hide();
        $("#consumerContent").hide();
        $('#consumerfilters').show();
        return false;
    });
    $('#distFiltersShortCut').click(function() {
        $('#consumerfilters').hide();
        $("#mainPage").hide();
        $("#distributorContent").hide();
        $("#consumerContent").hide();
        $('#filters').show();
        return false;
    });

    $('button#submit').click(function() {
        $('#filters').hide();
        $( "#distributorContent" ).show().delay(5000);
        charts();
    });

    $('button#consSubmit').click(function() {
        $('#consumerfilters').hide();
        $( "#consumerContent" ).show().delay(5000);;
        charts();
    });

    function csvJSON(csv){

        var lines=csv.split("\n");

        var result = [];

        var headers=lines[0].split(",");

        for(var i=1;i<lines.length;i++){

            var obj = {};
            var currentline=lines[i].split(",");

            for(var j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);

        }

        return result;
    }
    function charts() {
        $.get('data/demo_v2.csv', function (data) {
            var data = csvJSON(data);
            var filterdata = _.filter(data, function (d) {
                return d["Room Temperature (F)"] == temperature && d["Climate"] == climate
            });
            var housefilterdata = _.filter(data, function (d) {
                return d["Household"] == household && d["Room Temperature (F)"] == temperature && d["Climate"] == climate
            });

            var groupbyhourdata = _.groupBy(filterdata,"Hour");
            var groupbyHousedata = _.groupBy(filterdata,"Household");

            var data = _.map(groupbyhourdata,function(d,index){
                return  {
                    "Hour" : parseInt(index),
                    "Ouside Temperature (F)":_.sumBy(d, function (o) {
                        return parseFloat(o["Ouside Temperature (F)"])
                    })/d.length,
                    "Predicted Consumption - Before Optimization(KWH)": _.sumBy(d, function (o) {
                        return parseFloat(o["Predicted Consumption - Before Optimization(KWH)"])
                    }),
                    "Predicted Consumption - After Optmization(KWH)":_.sumBy(d, function (o) {
                        return parseFloat(o["Predicted Consumption - After Optmization(KWH)"])
                    }),
                    "Actual Consumption (KWH)":_.sumBy(d, function (o) {
                        return parseFloat(o["Actual Consumption (KWH)"])
                    }),
                    "Predicted Price ($/KWH)":_.sumBy(d, function (o) {
                        return parseFloat(o["Predicted Price ($/KWH)"])
                    }),
                    "Actual Price ($/KWH)":_.sumBy(d, function (o) {
                        return parseFloat(o["Actual Price ($/KWH)"])
                    }),
                    "Cost to the Marketer - Predicted - Before Optimization($)":_.sumBy(d, function (o) {
                        return parseFloat(o["Cost to the Marketer - Predicted - Before Optimization($)"])
                    }),
                    "Cost to the Marketer - Predicted - After Optimization($)":_.sumBy(d, function (o) {
                        return parseFloat(o["Cost to the Marketer - Predicted - After Optimization($)"])
                    }),
                    "Cost to the Marketer - Actual($)":_.sumBy(d, function (o) {
                        return parseFloat(o["Cost to the Marketer - Actual($)"])
                    }),
                    "Cost to the Consumer - Predicted - Before Optimization($)":_.sumBy(d, function (o) {
                        return parseFloat(o["Cost to the Consumer - Predicted - Before Optimization($)"])
                    }),
                    "Cost to the Consumer - Predicted - After Optimization($)":_.sumBy(d, function (o) {
                        return parseFloat(o["Cost to the Consumer - Predicted - After Optimization($)"])
                    }),
                    "Cost to the Consumer - Actual($)":_.sumBy(d, function (o) {
                        return parseFloat(o["Cost to the Marketer - Actual($)"])
                    })
                }
            })

            var householdData = _.map(groupbyHousedata,function(d,index){
                return  {
                    "Household" : index,
                    "Ouside Temperature (F)":_.meanBy(d, function (o) {
                        return parseFloat(o["Ouside Temperature (F)"])
                    }),
                    "Predicted Consumption - Before Optimization(KWH)": _.sumBy(d, function (o) {
                        return parseFloat(o["Predicted Consumption - Before Optimization(KWH)"])
                    }),
                    "Predicted Consumption - After Optmization(KWH)":_.sumBy(d, function (o) {
                        return parseFloat(o["Predicted Consumption - After Optmization(KWH)"])
                    }),
                    "Actual Consumption (KWH)":_.sumBy(d, function (o) {
                        return parseFloat(o["Actual Consumption (KWH)"])
                    }),
                    "Predicted Price ($/KWH)":_.sumBy(d, function (o) {
                        return parseFloat(o["Predicted Price ($/KWH)"])
                    }),
                    "Actual Price ($/KWH)":_.sumBy(d, function (o) {
                        return parseFloat(o["Actual Price ($/KWH)"])
                    }),
                    "Cost to the Marketer - Predicted - Before Optimization($)":_.sumBy(d, function (o) {
                        return parseFloat(o["Cost to the Marketer - Predicted - Before Optimization($)"])
                    }),
                    "Cost to the Marketer - Predicted - After Optimization($)":_.sumBy(d, function (o) {
                        return parseFloat(o["Cost to the Marketer - Predicted - After Optimization($)"])
                    }),
                    "Cost to the Marketer - Actual($)":_.sumBy(d, function (o) {
                        return parseFloat(o["Cost to the Marketer - Actual($)"])
                    }),
                    "Cost to the Consumer - Predicted - Before Optimization($)":_.sumBy(d, function (o) {
                        return parseFloat(o["Cost to the Consumer - Predicted - Before Optimization($)"])
                    }),
                    "Cost to the Consumer - Predicted - After Optimization($)":_.sumBy(d, function (o) {
                        return parseFloat(o["Cost to the Consumer - Predicted - After Optimization($)"])
                    }),
                    "Cost to the Consumer - Actual($)":_.sumBy(d, function (o) {
                        return parseFloat(o["Cost to the Marketer - Actual($)"])
                    })
                }
            });

            householdData = _.orderBy(householdData, ['Household'], ['asc']);

            var total_units_consumed = _.sumBy(data, function (o) { return o["Actual Consumption (KWH)"]});
            var total_saving = 0;
            var total_units_consumed_per_house = _.sumBy(housefilterdata, function (o) { return parseFloat(o["Actual Consumption (KWH)"])});
            var total_saving_per_house = 0;
            _.map(data, function (d) {
                if (!_.isNaN(d["Cost to the Marketer - Actual($)"])) {
                    total_saving +=  parseFloat(d["Cost to the Marketer - Predicted - Before Optimization($)"]) - parseFloat(d["Cost to the Marketer - Actual($)"])
                }
            })
            _.map(housefilterdata, function (d) {
                if (!_.isEmpty(d["Cost to the Marketer - Actual($)"])) {
                    total_saving_per_house += parseFloat(d["Cost to the Marketer - Predicted - Before Optimization($)"]) - parseFloat(d["Cost to the Marketer - Actual($)"])
                }
            })

            var house_unit_consumption_options = {
                chart: {
                    renderTo: 'chart5',
                    defaultSeriesType: 'column'
                },
                title: {
                    text: 'House Types vs Units Consumed'
                },
                tooltip: {
                    shared: true,
                    valueDecimals: 3
                },
                yAxis: [{
                    title: {
                        text: 'Average Units (KWH)'
                    }
                }],
                credits: {
                    enabled: false
                }
            };
            house_unit_consumption_options.xAxis = {
                categories: _.map(householdData, function (d) {
                    return d["Household"]
                }),
                title: {
                    text: 'House Types'
                }
            }
            house_unit_consumption_options.series = [{
                name: "Actual Consumption (KWH)",
                data: _.map(householdData, function (d) {
                    return d["Actual Consumption (KWH)"]
                }),
                color:colors[0]
               }];

            // Unit consumption per house hold
            var unit_consumption_options = {
                chart: {
                    renderTo: 'chart',
                    defaultSeriesType: 'spline'
                },
                title: {
                    text: 'Time vs Units Consumed'
                },
                tooltip: {
                    shared: true,
                    valueDecimals: 3
                },
                yAxis: [{
                    title: {
                        text: 'Units'
                    }
                },
                    {
                        labels: {
                            format: '{value} F',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        title: {
                            text: 'Temperature (F)'
                        },
                        opposite: true
                    }],
                credits: {
                    enabled: false
                }
            };
            unit_consumption_options.xAxis = {
                categories: _.filter(_.uniq(_.map(data, function (d) {
                    return parseInt(d["Hour"])
                })), function (t) {
                    return t > 0;
                }),
                title: {
                    text: 'Hour'
                },
                plotBands: [{
                    color: '#f2f2f2', // Color value
                    from: 11.5, // Start of the plot band
                    to: 24, // End of the plot band
                    label: {text: 'Predicted'}
                }]
            }
            unit_consumption_options.series = [{
                name: "Actual Consumption (KWH)",
                data: _.map(data, function (d) {
                    return parseFloat(d["Actual Consumption (KWH)"])
                }),
                color:colors[0],
                zoneAxis: 'x',
                zones: [{
                    value: 12
                }, {
                    dashStyle: 'dot'
                }],
                zIndex: 4
            },
                {
                    name: "Predicted Consumption - Before Optimization(KWH)",
                    data: _.map(data, function (d) {
                        return parseFloat(d["Predicted Consumption - Before Optimization(KWH)"])
                    }),
                    color:colors[5],
                    dashStyle: 'dot',
                    zIndex: 3
                },
                {
                    name: "Predicted Consumption - After Optmization(KWH)",
                    data: _.map(data, function (d) {
                        return parseFloat(d["Predicted Consumption - After Optmization(KWH)"])
                    }),
                    color:colors[3],
                    dashStyle: 'dot',
                    zIndex: 2
                },
                {
                    name: "Ouside Temperature (F)",
                    yAxis: 1,
                    type: 'column',
                    color:colors[6],
                    data: _.map(data, function (d) {
                        return parseFloat(d["Ouside Temperature (F)"])
                    }),
                    tooltip: {
                        valueSuffix: 'F'
                    },
                    zIndex: 1
                }];

            // Price chart per house hold
            var price_chart_options = {
                chart: {
                    renderTo: 'chart1',
                    defaultSeriesType: 'spline'
                },
                title: {
                    text: 'Time vs Price'
                },
                tooltip: {
                    shared: true,
                    valueDecimals: 3
                },

                yAxis: [
                    { // Primary yAxis
                    title: {
                        text: 'Price ($/KWH)'
                    }

                },
                    {       labels: {
                            format: '{value} F',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        title: {
                            text: 'Temperature (F)'
                        },
                        opposite: true
                    }],
                credits: {
                    enabled: false
                }
            };
            price_chart_options.xAxis = {
                categories: _.filter(_.uniq(_.map(data, function (d) {
                    return parseInt(d["Hour"])
                })), function (t) {
                    return t > 0;
                }),
                title: {
                    text: 'Hour'
                },
                plotBands: [{
                        color: '#f2f2f2', // Color value
                        from: 11.5, // Start of the plot band
                        to: 24, // End of the plot band
                        label: {text: 'Predicted'}
                    }]
            }
            price_chart_options.series = [{
                name: "Actual Price ($/KWH)",
                zoneAxis: 'x',
                zones: [{
                    value: 12
                }, {
                    dashStyle: 'dot'
                }],
                color:colors[0],
                data: _.map(data, function (d) {
                    return parseFloat(d["Actual Price ($/KWH)"])
                }),
                tooltip: {
                    valuePrefix: '$'
                },
                zIndex: 3
            },
                {
                    name: "Predicted Price ($/KWH)",
                    dashStyle: 'dot',
                    data: _.map(data, function (d) {
                        return parseFloat(d["Predicted Price ($/KWH)"])
                    }),
                    color:colors[8],
                    zIndex: 2,
                    tooltip: {
                        valuePrefix: '$'
                    }
                },
                {
                    name: "Ouside Temperature (F)",
                    type: 'column',
                    yAxis: 1,
                    color:colors[6],
                    data: _.map(data, function (d) {
                        return parseFloat(d["Ouside Temperature (F)"])
                    }),
                    tooltip: {
                        valueSuffix: 'F'
                    },
                    zIndex: 1
                }];

            var market_chart_options = {
                chart: {
                    renderTo: 'chart2',
                    defaultSeriesType: 'spline'
                },
                tooltip: {
                    shared: true,
                    valueDecimals: 3
                },
                title: {
                    text: 'Time vs Cost To Distributor'
                },
                yAxis: { // Primary yAxis
                    title: {
                        text: 'Price ($ in thousands)'
                    }
                },

                credits: {
                    enabled: false
                }
            };
            market_chart_options.xAxis = {
                categories: _.filter(_.uniq(_.map(data, function (d) {
                    return parseInt(d["Hour"])
                })), function (t) {
                    return t > 0;
                }),
                title: {
                    text: 'Hour'
                },
                plotBands: [{
                    color: '#f2f2f2', // Color value
                    from: 11.5, // Start of the plot band
                    to: 24, // End of the plot band
                    label: {text: 'Predicted'}
                }]
            }
            market_chart_options.series = [{
                name: "Cost to the Distributor - Predicted - Before Optimization($)",
                color:colors[5],
                data: _.map(data, function (d) {
                    return parseFloat(d["Cost to the Marketer - Predicted - Before Optimization($)"])
                }),
                dashStyle: 'dot',
                tooltip: {
                    valuePrefix: '$'
                }
            },
                {
                    name: "Cost to the Distributor - Predicted - After Optimization($)",
                    color:colors[3],
                    data: _.map(data, function (d) {
                        return parseFloat(d["Cost to the Marketer - Predicted - After Optimization($)"])
                    }),
                    dashStyle: 'dot',
                    tooltip: {
                        valuePrefix: '$'
                    }
                },
                {
                    name: "Cost to the Distributor - Actual($)",
                    data: _.map(data, function (d) {
                        return parseFloat(d["Cost to the Marketer - Actual($)"])
                    }),
                    color:colors[0],
                    tooltip: {
                        valuePrefix: '$'
                    }
                }];

            var temp_vs_unit_chart_options = {
                chart: {
                    renderTo: 'chart4',
                    defaultSeriesType: 'spline'
                },
                tooltip: {
                    shared: true,
                    valueDecimals: 3
                },
                title: {
                    text: 'Temperature vs Units Consumed'
                },
                yAxis: [{ // Primary yAxis
                    title: {
                        text: 'Total Units (KWH)'
                    }
                },
                    {
                        labels: {
                            format: '$ {value}',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        title: {
                            text: 'Price ($)'
                        },
                        opposite: true
                    }],
                xAxis: { // Primary yAxis
                    title: {
                        text: 'Temperature (F)'
                    }
                },
                credits: {
                    enabled: false
                }
            };
            _.map(data, function (d) {
                d["Ouside Temperature (F)"] = parseFloat(d["Ouside Temperature (F)"])
            })
            var dataorderByTemp = _.orderBy(data, ['Ouside Temperature (F)'], ['asc']);
            temp_vs_unit_chart_options.xAxis = {
                categories: _.map(dataorderByTemp, function (d) {
                    return parseFloat(d["Ouside Temperature (F)"])
                }),
                title: {
                    text: 'Temperature (F)'
                }
            }
            temp_vs_unit_chart_options.series = [{
                name: "Actual Consumption (KWH)",
                type: "column",
                yAxis: 1,
                color:colors[0],
                data: _.map(dataorderByTemp, function (d) {
                    return parseFloat(d["Actual Consumption (KWH)"])
                })
            },
                {
                    name: "Actual Price ($/KWH)",
                    color:colors[3],
                    data: _.map(dataorderByTemp, function (d) {
                        return parseFloat(d["Actual Price ($/KWH)"])
                    }),
                    tooltip: {
                        valuePrefix: '$'
                    }
                }];

            var cons_temp_vs_unit_chart_options = {
                chart: {
                    renderTo: 'chart7',
                    defaultSeriesType: 'spline'
                },
                tooltip: {
                    shared: true,
                    valueDecimals: 3
                },
                title: {
                    text: 'Time vs Units Consumed vs Cost'
                },
                yAxis: [{ // Primary yAxis
                    title: {
                        text: 'Total Units (KWH)'
                    }
                },
                    {
                        labels: {
                            format: '$ {value}',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        title: {
                            text: 'Price ($)'
                        },
                        opposite: true
                    }],
                xAxis: { // Primary yAxis
                    title: {
                        text: 'Temperature (F)'
                    }
                },
                credits: {
                    enabled: false
                }
            };
            _.map(housefilterdata, function (d) {
                d["Ouside Temperature (F)"] = parseInt(d["Ouside Temperature (F)"])
            })
            var housedataorderByTemp = _.orderBy(housefilterdata, ['Hour'], ['asc']);
            cons_temp_vs_unit_chart_options.xAxis = {
                categories: _.map(housefilterdata, function (d) {
                    return parseInt(d["Hour"])
                }),
                title: {
                    text: 'Hour'
                }
            }
            cons_temp_vs_unit_chart_options.series = [{
                name: "Actual Consumption (KWH)",
                type: "column",
                yAxis: 1,
                color:colors[0],
                data: _.map(housefilterdata, function (d) {
                    return parseFloat(d["Actual Consumption (KWH)"])
                })
            },
                {
                    name: "Actual Price ($/KWH)",
                    color:colors[3],
                    data: _.map(housefilterdata, function (d) {
                        return parseFloat(d["Actual Price ($/KWH)"])
                    }),
                    tooltip: {
                        valuePrefix: '$'
                    }
                }];

            // Distributor Charts
            if ($('#chart').length) {
                var chart1 = new Highcharts.Chart(unit_consumption_options);
            }
            if ($('#chart1').length) {
                var chart2 = new Highcharts.Chart(price_chart_options);
            }
            if ($('#chart2').length) {
                var chart3 = new Highcharts.Chart(market_chart_options);
            }
            if ($('#chart4').length) {
                var chart3 = new Highcharts.Chart(temp_vs_unit_chart_options);
            }

            if ($('#chart5').length) {
                var chart3 = new Highcharts.Chart(house_unit_consumption_options);
            }
            if ($('#chart7').length) {
                var chart3 = new Highcharts.Chart(cons_temp_vs_unit_chart_options);
            }

            if ($('#total_saving').length) {
                $("#total_saving").text(_.round(total_saving*250, 2));
            }
            if($('#total_unit_consumed').length) {
                $("#total_unit_consumed").text(_.round(total_units_consumed, 2));
            }

            if ($('#house').length) {
                $("#house").text(household);
            }
            if ($('#consumser_climate').length) {
                $("#consumser_climate").text(climate);
            }
            if ($('#distributor_climate').length) {
                $("#distributor_climate").text(climate);
            }
            if ($('#distributor_temp').length) {
                $("#distributor_temp").text(temperature);
            }
            if ($('#consumser_temp').length) {
                $("#consumser_temp").text(temperature);
            }
            if ($('#house_saving').length) {
                $("#house_saving").text(_.round(total_saving_per_house, 2));
            }
            if($('#house_total_units').length) {
                $("#house_total_units").text(_.round(total_units_consumed_per_house, 2));
            }

            var consumers_cost_chart_options = {
                chart: {
                    renderTo: 'chart3',
                    defaultSeriesType: 'spline'
                },
                tooltip: {
                    shared: true,
                    valueDecimals: 3
                },
                title: {
                    text: 'Time vs Cost To Consumers'
                },
                yAxis: { // Primary yAxis
                    title: {
                        text: 'Price ($/KWH)'
                    }
                },

                credits: {
                    enabled: false
                }
            };
            consumers_cost_chart_options.xAxis = {
                categories: _.filter(_.uniq(_.map(data, function (d) {
                    return parseInt(d["Hour"])
                })), function (t) {
                    return t > 0;
                }),
                title: {
                    text: 'Hour'
                }
            }
            consumers_cost_chart_options.series = [{
                name: "Cost to the Consumer - Predicted - Before Optimization($)",
                color:colors[5],
                data: _.map(data, function (d) {
                    return parseFloat(d["Cost to the Consumer - Predicted - Before Optimization($)"])
                }),
                dashStyle: 'dot',
                tooltip: {
                    valuePrefix: '$'
                }
            },
                {
                    name: "Cost to the Consumer - Predicted - After Optimization($)",
                    color:colors[3],
                    data: _.map(data, function (d) {
                        return parseFloat(d["Cost to the Consumer - Predicted - After Optimization($)"])
                    }),
                    dashStyle: 'dot',
                    tooltip: {
                        valuePrefix: '$'
                    }
                },
                {
                    name: "Cost to the Consumer - Actual($)",
                    data: _.map(data, function (d) {
                        return parseFloat(d["Cost to the Consumer - Actual($)"])
                    }),
                    color:colors[0],
                    tooltip: {
                        valuePrefix: '$'
                    }
                }];
            //Consumers Charts
            if ($('#chart3').length) {
                var chart1 = new Highcharts.Chart(consumers_cost_chart_options);
            }

            var consumner_cost_chart_options = {
                chart: {
                    renderTo: 'chart6',
                    defaultSeriesType: 'column'
                },
                tooltip: {
                    shared: true,
                    valueDecimals: 3
                },
                title: {
                    text: 'Time vs Cost Savings'
                },
                yAxis: { // Primary yAxis
                    title: {
                        text: '$'
                    }
                },

                credits: {
                    enabled: false
                }
            };
            consumner_cost_chart_options.xAxis = {
                categories: _.filter(_.uniq(_.map(housefilterdata, function (d) {
                    return parseInt(d["Hour"])
                })), function (t) {
                    return t > 0;
                }),
                title: {
                    text: 'Hour'
                }
            }
            consumner_cost_chart_options.series = [{
                    name: "Cost Saving ($)",
                    data: _.map(housefilterdata, function (d) {
                        return parseFloat(d["Cost to the Marketer - Predicted - Before Optimization($)"]) - parseFloat(d["Cost to the Marketer - Actual($)"])
                    }),
                    color:colors[0],
                    dashStyle: 'dot',
                    tooltip: {
                        valuePrefix: '$'
                    }
                }];
            //Consumers Charts
            if ($('#chart6').length) {
                var chart1 = new Highcharts.Chart(consumner_cost_chart_options);
            }

        });
    }
});