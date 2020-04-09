import React, { useState, useCallback, useEffect } from 'react'

// nodejs library that concatenates classes
import classNames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
import StarIcon from '@material-ui/icons/Star';
import BusinessIcon from '@material-ui/icons/Business';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import PinDropSharpIcon from '@material-ui/icons/PinDropSharp';

// core components
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import { useFetch } from "functionality/useFetch.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

// maps
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";


// spinner
import { SwishSpinner } from "react-spinners-kit";

// variables
import * as constant from "constants/variables.js"

// Gallery section
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

// style componends
import profilePageStyle from "assets/jss/material-kit-pro-react/views/profilePageStyle.js";
const useStyles = makeStyles(profilePageStyle)


function ProfilePage() {
    

  const classes = useStyles();

  //======
  // handle image view
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [delayer, setDelayer] = useState(true);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };
  //======

  //======
  // handle data fetch
  const { data, photos, loading } = useFetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${constant.place_id}&fields=icon,photos,name,rating,formatted_phone_number,opening_hours,geometry,formatted_address&key=${constant.google_api_key}`);
  // delayed a bit for UX purposes
  const delay = t => new Promise(resolve => setTimeout(resolve, t));
  delay(1500).then(() => {
    setDelayer(false);
  })
  //======


  //======
  // map component builder
  const RegularMap = withScriptjs(
    withGoogleMap(props => (
      <GoogleMap
        defaultZoom={15}
        defaultCenter={{ lat: data.result.geometry.location.lat, lng: data.result.geometry.location.lng }}
        defaultOptions={{
          scrollwheel: false
        }}
      >
        <Marker position={{ lat: data.result.geometry.location.lat, lng: data.result.geometry.location.lng }} />
      </GoogleMap>
    ))
  );

  function mapsSelector() {
    if /* if we're on iOS, open in Apple Maps */
      ((navigator.platform.indexOf("iPhone") != -1) ||
      (navigator.platform.indexOf("iPad") != -1) ||
      (navigator.platform.indexOf("iPod") != -1))
      window.open(`maps://maps.google.com/maps?daddr=${data.result.geometry.location.lat},${data.result.geometry.location.lng}&amp;ll=`);
    else /* else use Google */
      window.open(`https://maps.google.com/maps?daddr=${data.result.geometry.location.lat},${data.result.geometry.location.lng}&amp;ll=`);
  }
  //======

  return (

    // wait until loading is done and delay is completed
    <div>{(loading || delayer) ?
      <div style={{
        margin: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <SwishSpinner size={50} color="#0984e3" loading={delayer} />
      </div>
      :
      <div>
        <div
          className={classes.parallax}
        >
          <Gallery photos={photos} onClick={openLightbox} direction='column' columns={5} />
        </div>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>
            <GridContainer justify="center" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <GridItem style={window.innerWidth <= 990 ? { display: 'flex', flex: 1, flexDirection: 'column' } : { display: 'flex', flex: 1, flexDirection: 'row' }}>
                <Card style={window.innerWidth <= 990 ? { alignSelf: 'center', maxWidth: 250, maxHeight: 185, marginTop: -50 } : { maxWidth: 250, maxHeight: 250, marginTop: -50 }}>
                  <img
                    className={classes.imgCard}
                    style={constant.logo_url !== null ? {objectFit: 'contain'} : {objectFit: 'cover'}}
                    src={constant.logo_url !== null ? constant.logo_url : `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&maxheight=1200&photoreference=${data.result.photos[0].photo_reference}&key=${constant.google_api_key}`}
                    alt="Card-image-business-logo-main-image" />
                </Card>
                <div style={window.innerWidth <= 990 ? { textAlign: 'center' } : { marginLeft: 35, marginTop: 20 }}>
                  <h3>{data.result.name}</h3>
                  <Card style={window.innerWidth <= 990 ? { height: 35, width: 100, margin: 0, display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', left: '50%', transform: 'translate(-50%)' } : { height: 35, width: 100, margin: 0, display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: 24 }}>{data.result.rating}</span>
                    <StarIcon fontSize='small' style={{ marginLeft: 5, color: '#FED700' }} />
                  </Card>
                </div>
              </GridItem>
              <GridItem xs={12} style={window.innerWidth <= 990 ? { flex: 1, display: 'flex', flexDirection: 'column' } : { flex: 1, display: 'flex', flexDirection: 'row' }}>
                <GridItem xs={12}>
                  <Card style={window.innerWidth <= 990 ? {height: 350} : {height: '92%'}}>
                    <RegularMap
                      style={{borderRadius: "calc(.25rem - 1px)"}}
                      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${constant.google_api_key}`}
                      loadingElement={<div style={{ height: '100%' }} />}
                      containerElement={<div style={{ height: '100%' }} />}
                      mapElement={<div style={{ height: '100%', borderRadius: "calc(.25rem - 1px)" }} />}
                    />
                  </Card>
                </GridItem>
                <GridItem xs={window.innerWidth <= 990 ? 12 : 6}>
                  <Card>
                    <CardHeader color="danger">Hours</CardHeader>
                    <List component="nav">
                      {data.result.opening_hours.weekday_text.map((item, key) => {
                        return (
                          <ListItem key={key}>
                            <ListItemText>{item}</ListItemText>
                          </ListItem>
                        )
                      })}
                    </List>
                  </Card>
                  <div style={{ marginTop: 50 }}>
                    <CustomTabs
                      headerColor="primary"
                      tabs={[
                        {
                          tabName: "Details",
                          tabIcon: BusinessIcon,
                          tabContent: (
                            <div>
                              <Button className={classes.detailsButton} onClick={() => { window.open(`tel:${data.result.formatted_phone_number}`) }}>
                                {data.result.formatted_phone_number}
                              </Button>
                              <Button className={classes.detailsButton} onClick={() => { mapsSelector() }}>
                                {data.result.formatted_address}
                              </Button>
                            </div>
                          )
                        },
                        {
                          tabName: "Contact us",
                          tabIcon: PermContactCalendarIcon,
                          tabContent: (
                            <form>
                              <CustomInput
                                labelText="Your Name"
                                id="float"
                                formControlProps={{
                                  fullWidth: true
                                }}
                              />
                              <CustomInput
                                labelText="Email address"
                                id="float"
                                formControlProps={{
                                  fullWidth: true
                                }}
                              />
                              <CustomInput
                                labelText="Your message"
                                id="float"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  multiline: true,
                                  rows: 6
                                }}
                              />
                              <div className={classes.textCenter}>
                                <Button color="primary" round>
                                  Send
                              </Button>
                              </div>
                            </form>
                          )
                        }
                      ]}
                    />
                  </div>
                </GridItem>
              </GridItem>
            </GridContainer>
          </div>
          <ModalGateway>
            {viewerIsOpen ? (
              <Modal onClose={closeLightbox}>
                <Carousel
                  currentIndex={currentImage}
                  views={photos.map((x, key) => ({
                    ...x,
                    srcset: x.srcSet,
                    caption: x.title
                  }))}
                />
              </Modal>
            ) : null}
          </ModalGateway>
        </div>
        <Footer
          content={
            <div>
              <div className={classes.right}>
                COPYRIGHT
              &copy; {1900 + new Date().getYear()}, made with{" "}
                <Favorite className={classes.icon} /> by{" "}
                <a
                  href="https://openauto.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Auto
              </a>{" "}
                for a better web.
            </div>
            </div>
          }
        />
      </div>
    }
    </div>

  );
}

export default ProfilePage;
