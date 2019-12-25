    const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];
    dataset.sort((a, b) => {return b - a});

    const w = 500;
    const h = 500;

    //set the margins
    const m = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3.select("body").append("svg")
        .attr("width", w + m.left + m.right)//Sirina i visina celokupnog svg elementa.
        .attr("height", h + m.top + m.bottom);

    //Pozicioniranje samog chart-a unutar svg-a.
    const g = svg.append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

    // the xScale for the bar chart will be a band scale
    /*range je duzina linije po x osi koja se gleda od sirine svg-a.
    domain su vrednosti koje se automatski nalaze kada se indeksi dataset-a
    uzmu kao parametar. Zatim se indeksi pravilno rasporede po sirini(width-w), tj. range-u.*/
    let xScale = d3.scaleBand()
            .range([0, w])
            .padding(0.1)//Since the domain is about the index of the values, the domain must be an array of the indices for the x-axis scale
            .domain(dataset.map( (d,i) => { 
                return i; 
            }));

    //for the y-axis scale since it is a linear scale you just mention the array extent as the domain
    /*Kod y ose je slicno, ali malo drugacije. U domain-u umesto indeksa, 
    prikazuju se istoimene vrednosti, a range je visina(h) po kome se redjaju vrednosti.*/
    let yScale = d3.scaleLinear()
            .range([h, 0])
            .domain([0, d3.max(dataset)]);

    // draw the axis
    const xAxis = d3.axisBottom(xScale); //X axis
    
    g.append("g")
        .attr("transform", "translate(0," + h + ")")
        .attr("class", "axis")
        .call(xAxis);

    const yAxis = d3.axisLeft(yScale); //Y axis
    g.append("g")
        .attr("transform", "translate(0, 0)")//Ako se pravilno setuje u yScale, onda se ovde ne mora raditi translacija.
        .attr("class", "axis")
        .call(yAxis);
    
    /*Dakle x osa je width i po njoj se redjaju indeksi,
    y osa je height i po njoj se redjaju vrednosti od gore pomenutih indeksa.*/
    /*
    Kada se sve izracuna  u xAxis i yAxis, onda se prosledjuje 
    kao parametar za x i y koordinatu bar-a.
    */

    let rect = [];

    //draw the rectangles
    g.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d, i) => {//d je vrednost iz niza.
            return xScale(i);//koordinate za tik, odnosno sredinu pojedinacnog bar-a.
        }) //the displacement along the x is dependendant on the index and the xScale
        .attr("y", (d) => { 
            return yScale(d);//Proracunata vrednost displejsmenta od vrha. 
        }) //the displacement along the y is dependant on the value and the yScale
        .attr("height", (d) => { 
            return h - yScale(d); //Proracun visine pojedinacnog bara.
        }) //the height is the difference between the displacement down and the height of the chart h
        .attr("width", xScale.bandwidth()) //Proracun sirine el. bez padinga. //the width of the rectangles is dependant on the bandwidth
        .attr("class", "bar")
        .append("title")
        .text((item, i) => {
            rect.push({
                value: item,
                index: i,
                w: w,
                h: h,
                xScale: xScale(i),
                yScale: yScale(item),
                elemWidth: xScale.bandwidth(),
                elemHeight: h - yScale(item),
            });
            
            return item;
        });

        console.log(rect);

    //Draw the  Chart Label:
    svg.append("text")
        .attr("class", "title")
        .attr("x", w / 2) //positions it at the middle of the width
        .attr("y", m.top) //positions it from the top by the margin top
        .attr("font-family", "sans-serif")
        .attr("fill", "green")
        .attr("text-anchor", "middle")
        .text("Chart");