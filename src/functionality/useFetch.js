import { useEffect, useState } from 'react';
import * as constant from 'constants/variables.js'
import style from 'assets/jss/material-kit-pro-react/rotatingCards';

var sizeOf = require('image-size');
var url = require('url');
var http = require('http');


export const useFetch = (fetchUrl) => {

    //render the data from the fetchUrl // Google places API
    const [details, setDetails] = useState({ data: null, photos: [], loading: true });

    useEffect(() => {
        let photos = [];
        fetch(fetchUrl, { method: 'GET' })
            .then(response => response.json())
            .then((returnData) => {
                returnData.result.photos.map(async (item, key) => {
                    let dimensions = 0;
                    let source = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&maxheight=1200&photoreference=${item.photo_reference}&key=${constant.google_api_key}`
                    http.get(url.parse(source), function (response) {
                        var chunks = [];
                        response.on('data', function (chunk) {
                            chunks.push(chunk);
                        }).on('end', function () {
                            var buffer = Buffer.concat(chunks);
                            dimensions = sizeOf(buffer);
                        });
                    });
                    let WID = dimensions.width == dimensions.height ? 4 : dimensions.width < dimensions.height ? 3 : 4
                    let HIG = dimensions.height == dimensions.width ? 4 : dimensions.height < dimensions.width ? 3 : 4
                    photos[key] = {
                        src: source,
                        width: WID,
                        height: HIG,
                        style: {
                            objectFit: 'cover'
                        }
                    }
                })
                return returnData
            })
            .then((retData) => {
                setDetails({ data: retData, photos: photos, loading: false })
            })
            .catch(() => {
                console.log("catch triggered in useFetch");
            })
    }, []);
    return details;
}