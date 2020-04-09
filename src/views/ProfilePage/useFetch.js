export const useFetch = (fetchUrl) => {

    //render the data from the fetchUrl // Google places API
    const [data, setData] = React.useState({ data: null, photos: [],loading: true });

    React.useEffect(() => {
        fetch(fetchUrl, { method: 'GET' })
            .then(response => response.json())
            .then(returnData.result.map(item => {
                console.log("hello")
            }))
            .then(returnData => {
                setData({
                    data: returnData,
                    loading: false
                });
            });
    }, []);
    return data;
}