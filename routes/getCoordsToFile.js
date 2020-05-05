const parse = require('csv-parse');
const fs = require('fs');

let nodeFile = './routes/nodesChanged.csv';

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: './routes/out.csv',
    header: [
        {id: 'Neighbor ID', title: 'Neighbor ID'},
        {id: 'Node Name', title: 'Node Name'},
        {id: 'Primary Contact', title: 'Primary Contact'},
        {id: 'Address', title: 'Address'},
        {id:'Xcoord',title:'Xcoord'},
        {id:'Ycoord',title:'Ycoord'}
    ]
});

let nodes =[];
const getCoordsURL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';

let coordsParams = {
    'f':'json',
    'singleLine':'',
    'outFields': 'Match_addr,Addr_type',
    //'token':''
};

const authentication = new ApplicationSession({
    clientId: process.env.AGOL_CLIENT_ID,
    clientSecret: process.env.AGOL_CLIENT_SECRET
});

const parser = parse({delimiter: ','}, async function (err, data) {
    // when all countries are available,then process them
    // note: array element at index 0 contains the row of headers that we should skip
    console.log(data);

    for (let i = 1; i < data.length; i++) {
        console.log(data[i][3]);
        coordsParams.singleLine = data[i][3];

        await request(getCoordsURL, {authentication, params: coordsParams}).then((r) => {
            console.log(r.candidates);
            let node = {
                "Neighbor ID": data[i][0]
                , "Node Name": data[i][1]
                , "Primary Contact": data[i][2]
                , "Address": data[i][3]
                , "Xcoord": r.candidates[0].location.x
                , "Ycoord": r.candidates[0].location.y
            };
            nodes.push(node);

        }).catch((err) => {
            console.log(err);
        });


    }
    csvWriter.writeRecords(nodes).then(() => {
        console.log('Done?');
    })
});

fs.createReadStream(nodeFile).pipe(parser);
