import { Component, NgZone, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { PaymentsService } from 'src/app/shared/payments.service';
import { PaymentCategory, PaymentType, Payment } from 'src/app/shared/payment.model';
import { Subscription } from 'rxjs';

am4core.useTheme(am4themes_animated);
  
@Component({ 
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  private chart: am4charts.PieChart;
  constructor(private zone: NgZone, private paymentService: PaymentsService) {}


  ngAfterViewInit() {
    this.chart = am4core.create('chartdiv', am4charts.PieChart);

    // Add and configure Series
    const pieSeries = this.chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'vydaje';
    pieSeries.dataFields.category = 'kategorie';

    // Let's cut a hole in our Pie chart the size of 30% the radius
    this.chart.innerRadius = am4core.percent(30);

      // Put a thick white border around each Slice
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template
    // change the cursor on hover to make it apparent the object can be interacted with
    .cursorOverStyle = [
      {
        property: 'cursor',
        value: 'pointer'
      }
    ];

    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.labels.template.text = '{value.percent.formatNumber(\'#.0\')}%';
    pieSeries.labels.template.radius = am4core.percent(-20);
    pieSeries.labels.template.fill = am4core.color('white');

    // Create a base filter effect (as if it's not there) for the hover to return to
    // tslint:disable-next-line: new-parens
    const shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
    shadow.opacity = 0;

    // Create hover state
    const hoverState = pieSeries.slices.template.states
                      .getKey('hover'); // normally we have to create the hover state, in this case it already exists

    // Slightly shift the shadow and make it more prominent on hover
    // tslint:disable-next-line: new-parens
    const hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;

    // Add a legend
    this.chart.legend = new am4charts.Legend();

    this.loadChartData();
    }

  loadChartData() {
    const payments = this.paymentService.getPayments();
    const map = new Map<PaymentCategory, number>();
    payments.forEach(payment => {
      if (payment.paymentType === PaymentType.Debety) {
        if (map.has(payment.paymentCategory)) {
          const value = map.get(payment.paymentCategory) + payment.amount;
          map.set(payment.paymentCategory, value);
        } else {
          map.set(payment.paymentCategory, payment.amount);
        }
      }
    });
    map.forEach((value: number, key: PaymentCategory) => {
      this.chart.data.push({kategorie: key, vydaje: value});
  });

  }
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}