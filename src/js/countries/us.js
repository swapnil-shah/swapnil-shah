function pieLegend(tot, pos, neg, hosp, ven, icu, hospCurrent, venCurrent, icuCurrent) {
	let pieNumbersContainer = '';
	if (tot) {
		pieNumbersContainer += `<h6 class="list-group-item list-group-item text-dark card-text mt-2 mb-0">
		<span class="text-gray-600 mr-1">Total Test Results </span>${tot.toLocaleString()}</h6>`;
	}
	if (pos) {
		pieNumbersContainer += `<div class="list-group-item list-group-item text-dark card-text"><span class="legend-marker mr-1 ml-2 shakespeare"></span>
		<span class="text-muted mr-1">Positive </span>${pos.toLocaleString()}</div>`;
	}
	if (neg) {
		pieNumbersContainer += `<div class="list-group-item list-group-item text-dark card-text"><span class="legend-marker mr-1 ml-2 keppel"></span>
		<span class="text-muted mr-1">Negative </span>${neg.toLocaleString()}</div>`;
	}
	if (hosp) {
		pieNumbersContainer += `<h6 class="list-group-item list-group-item text-dark card-text mt-2 mb-0">
		<span class="text-gray-600 mr-1">Hospitalized Cumulative </span>${hosp.toLocaleString()}</h6>`;
	}
	if (hospCurrent) {
		pieNumbersContainer += `<div class="list-group-item list-group-item text-dark card-text"><span class="legend-marker mr-1 ml-2 tuatara"></span>
		<span class="text-muted mr-1">Hospitalized Currently </span>${hospCurrent.toLocaleString()}</div>`;
	}
	if (ven) {
		pieNumbersContainer += `<h6 class="list-group-item list-group-item text-dark card-text mt-2 mb-0">
		<span class="text-gray-600 mr-1">On Ventilator Cumulative </span>${ven.toLocaleString()}</h6>`;
	}
	if (venCurrent) {
		pieNumbersContainer += `<div class="list-group-item list-group-item text-dark card-text"><span class="legend-marker mr-1 ml-2 yellow-orange"></span>
		<span class="text-muted mr-1">On Ventilator Currently </span>${venCurrent.toLocaleString()}</div>`;
	}
	if (icu) {
		pieNumbersContainer += `<h6 class="list-group-item list-group-item text-dark card-text mt-2 mb-0">
		<span class="text-gray-600 mr-1">In ICU Cumulative </span>${icu.toLocaleString()}</h6>`;
	}
	if (icuCurrent) {
		pieNumbersContainer += `<div class="list-group-item list-group-item text-dark card-text"><span class="legend-marker mr-1 ml-2 wild-watermelon"></span>
		<span class="text-muted mr-1">In ICU Currently </span>${icuCurrent.toLocaleString()}</div>`;
	}
	return pieNumbersContainer;
}
$(document).ready(function() {
	//Building pie chart
	// https://covidtracking.com/api/v1/states/ny/current.json
	fetch('https://covidtracking.com/api/v1/us/current.json').then((response) => response.json()).then(function(state) {
		var ctxTotalCases = document.getElementById('pie-chart-total-cases');
		var ctxhospitliazed = document.getElementById('pie-chart-hospitliazed');
		let lastUpdatedPie = document.getElementById('last-updated-pie');
		let pieNumberContainer = document.getElementById('pie-numbers');
		let lastUpdatedHtmlUs = `Last updated ${timeDifference(state[0].lastModified)}`;
		let usPieNumbers = pieLegend(
			state[0].totalTestResults,
			state[0].positive,
			state[0].negative,
			state[0].hospitalizedCumulative,
			state[0].hospitalizedCurrently,
			state[0].inIcuCumulative,
			state[0].inIcuCurrently,
			state[0].onVentilatorCumulative,
			state[0].onVentilatorCurrently
		);
		pieNumberContainer.innerHTML = usPieNumbers;
		lastUpdatedPie.innerHTML = lastUpdatedHtmlUs;
		var usaDataTotal = [
			{
				data: [ state[0].positive, state[0].negative ],
				backgroundColor: [ '#3e95cd', '#3cba9f' ]
			}
		];
		var usaDataHospitalize = [
			{
				data: [ state[0].inIcuCurrently, state[0].onVentilatorCurrently ],
				backgroundColor: [ '#FF6385', '#FF9F40' ]
			}
		];
		var myPieChartTotalCases = new Chart(ctxTotalCases, {
			type: 'pie',
			data: {
				labels: [ 'Positive', 'Negative' ],
				datasets: usaDataTotal
			},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				title: {
					display: true,
					text: 'Total Cases'
				},
				tooltips: {
					backgroundColor: 'rgb(255,255,255)',
					bodyFontColor: '#858796',
					borderColor: '#dddfeb',
					borderWidth: 1,
					xPadding: 15,
					yPadding: 15,
					displayColors: false,
					caretPadding: 10,
					mode: 'label',
					callbacks: {
						label: function(tooltipItem, data) {
							var dataLabel = data.labels[tooltipItem.index];
							var value =
								': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
							if (Chart.helpers.isArray(dataLabel)) {
								dataLabel = dataLabel.slice();
								dataLabel[0] += value;
							} else {
								dataLabel += value;
							}
							return dataLabel;
						}
					}
				},
				animation: {
					duration: 1000
				}
			}
		});
		var myPieChartHospitliazed = new Chart(ctxhospitliazed, {
			type: 'pie',
			data: {
				labels: [ 'In ICU Currently', 'On Ventilator Currently' ],
				datasets: usaDataHospitalize
			},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				title: {
					display: true,
					text: 'Hospitalized cases'
				},
				tooltips: {
					backgroundColor: 'rgb(255,255,255)',
					bodyFontColor: '#858796',
					borderColor: '#dddfeb',
					borderWidth: 1,
					xPadding: 15,
					yPadding: 15,
					displayColors: false,
					caretPadding: 10,
					callbacks: {
						label: function(tooltipItem, data) {
							var dataLabel = data.labels[tooltipItem.index];
							var value =
								': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
							if (Chart.helpers.isArray(dataLabel)) {
								dataLabel = dataLabel.slice();
								dataLabel[0] += value;
							} else {
								dataLabel += value;
							}
							return dataLabel;
						}
					},
					animation: {
						duration: 1000
					}
				}
			}
		});
		$('#selectRegion').on('change', function() {
			let value = $(this).val();
			if (value === 'usa') {
				lastUpdatedPie.innerHTML = lastUpdatedHtmlUs;
				pieNumberContainer.innerHTML = usPieNumbers;
				myPieChartTotalCases.data.datasets = usaDataTotal;
				myPieChartTotalCases.update();
				myPieChartTotalCases.options.animation.duration = 1000;
				myPieChartHospitliazed.data.datasets = usaDataHospitalize;
				myPieChartHospitliazed.update();
				myPieChartHospitliazed.options.animation.duration = 1000;
			} else {
				fetch('https://covidtracking.com/api/v1/states/' + value + '/current.json', { cache: 'no-cache' })
					.then((response) => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error('BAD HTTP');
						}
					})
					.then((state) => {
						pieNumberContainer.innerHTML = pieLegend(
							state.totalTestResults,
							state.positive,
							state.negative,
							state.hospitalizedCurrently,
							state.inIcuCurrently,
							state.onVentilatorCurrently
						);
						lastUpdatedPie.innerHTML = `Last updated ${timeDifference(state.dateChecked)}`;
						myPieChartTotalCases.data.datasets = [
							{
								data: [ state.positive, state.negative ],
								backgroundColor: [ '#3e95cd', '#3cba9f' ]
							}
						];
						myPieChartTotalCases.update();
						myPieChartTotalCases.options.animation.duration = 1000;
						if (state.inIcuCurrently && state.onVentilatorCurrently) {
							myPieChartHospitliazed.data.datasets = [
								{
									data: [ state.inIcuCurrently, state.onVentilatorCurrently ],
									backgroundColor: [ '#FF6385', '#FF9F40', '#8e5ea2' ]
								}
							];
						} else {
							myPieChartHospitliazed.data.datasets = [];
						}
						myPieChartHospitliazed.update();
						myPieChartHospitliazed.options.animation.duration = 1000;
					})
					.catch((err) => {
						console.log('ERROR:', err.message);
					});
			}
		});

		// Set new default font family and font color to mimic Bootstrap's default styling
		(Chart.defaults.global.defaultFontFamily = 'Nunito'),
			'-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
		Chart.defaults.global.defaultFontColor = '#858796';
		Chart.plugins.register({
			afterDraw: function(chart) {
				if (myPieChartHospitliazed.data.datasets.length === 0) {
					// No data is present
					var ctx = myPieChartHospitliazed.chart.ctx;
					var width = myPieChartHospitliazed.chart.width;
					var height = myPieChartHospitliazed.chart.height;
					myPieChartHospitliazed.clear();
					ctx.save();
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText('No data available.', width / 2, height / 2);
					ctx.restore();
				}
			}
		});
	});
	//Building Datatable

	fetch('https://covidtracking.com/api/v1/states/current.json')
		.then((response) => response.json())
		.then(function(states) {
			states
				.filter(function(posNeg) {
					return posNeg.positive && posNeg.negative;
				})
				.forEach(function(state) {
					let regionSelect = document.getElementById('selectRegion');
					regionSelect.options[regionSelect.options.length] = new Option(
						acronymToFullName(state.state),
						state.state
					);
				});
			$('#dataTableCountry').DataTable({
				data: states,
				pagingType: 'numbers',
				pageLength: 50,
				language: {
					searchPlaceholder: 'e.g. usa'
				},
				columns: [
					{
						title: 'State',
						data: 'state',
						render: function(data, type, row) {
							if (type === 'type' || type === 'sort') {
								return data;
							}
							return `${acronymToFullName(
								data
							)}<p class="text-muted small"> Last updated ${timeDifference(row.dateChecked)}</p>`;
						}
					},
					{
						title: 'Positive',
						data: 'positive',
						render: function(data, type, row) {
							if (type === 'type' || type === 'sort') {
								return data;
							}
							return data ? data.toLocaleString() : '-';
						}
					},
					{
						title: 'Recovered',
						data: 'recovered',
						render: function(data, type, row) {
							if (type === 'type' || type === 'sort') {
								return data;
							}
							return data ? data.toLocaleString() : '-';
						}
					},
					{
						title: 'Death',
						data: 'death',
						render: function(data, type, row) {
							if (type === 'type' || type === 'sort') {
								return data;
							}
							return data ? data.toLocaleString() : '-';
						}
					}
				],
				order: [ [ 1, 'desc' ] ]
			});
		});
});
