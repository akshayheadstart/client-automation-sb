import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import React from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import ClientRegTextField from "./ClientRegTextField";
const UploadLogoAndBg = ({
  preview,
  handleUploadImage,
  logoAndBg,
  setLogoAndBg,
  htmlTemplateURL,
  setHtmlTemplateURL,
  brochureURL,
  setBrochureURL,
  campusTourYoutubeURL,
  setCampusTourYoutubeURL,
  thankyouPageURL,
  setThankyouPageURL,
  googleTagManagerID,
  setGoogleTagManagerID,
  projectTitle,
  setProjectTitle,
  metaDescription,
  setMetaDescription,
}) => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [uploadedBackground, setUploadedBackground] = useState(null);
  const reset = () => {
    setHtmlTemplateURL("");
    setBrochureURL("");
    setCampusTourYoutubeURL("");
    setThankyouPageURL("");
    setGoogleTagManagerID("");
    setProjectTitle("");
    setMetaDescription("");
    setLogoAndBg({ logo: "", background: "" });
    setUploadedLogo(null);
    setUploadedBackground(null);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Box>
        <Typography variant="h6"> Student Dashboard Basic info</Typography>
        <form
          onSubmit={(e) => {
            handleUploadImage({
              e,
              uploadedBackground,
              uploadedLogo,
              setUploadLoading,
            });
            setUploadedBackground(null);
            setUploadedLogo(null);
          }}
        >
          <Grid container spacing={3} sx={{ pt: 2 }}>
            <Grid item md={6} sm={6} xs={12}>
              <ClientRegTextField
                value={htmlTemplateURL}
                setValue={setHtmlTemplateURL}
                label="Html template url"
                type="text"
                preview={preview}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <ClientRegTextField
                value={googleTagManagerID}
                setValue={setGoogleTagManagerID}
                label="Google Tag manager ID"
                type="text"
                preview={preview}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <ClientRegTextField
                value={projectTitle}
                setValue={setProjectTitle}
                label="Project Title"
                type="text"
                preview={preview}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <ClientRegTextField
                value={metaDescription}
                setValue={setMetaDescription}
                label="Meta Description"
                type="text"
                preview={preview}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <ClientRegTextField
                value={brochureURL}
                setValue={setBrochureURL}
                label="Brochure url"
                required={false}
                type="text"
                preview={preview}
              />
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <ClientRegTextField
                value={campusTourYoutubeURL}
                setValue={setCampusTourYoutubeURL}
                label="Campus tour youtube video url"
                required={false}
                type="text"
                preview={preview}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <ClientRegTextField
                value={thankyouPageURL}
                setValue={setThankyouPageURL}
                label="Do you need any widget in iframe?, If yes enter thank you page url"
                type="text"
                required={false}
                preview={preview}
              />
            </Grid>
            {logoAndBg?.logo && (
              <Box>
                <Grid container spacing={3} sx={{ pt: 3, px: 3 }}>
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography> Uploaded Logo</Typography>{" "}
                    <img
                      style={{ maxWidth: "100%" }}
                      src={logoAndBg?.logo}
                      alt="logo"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography sx={{ mb: 0.5 }} variant="subtitle2">
                      {" "}
                      Uploaded Favicon
                    </Typography>

                    <img
                      style={{ maxWidth: "100%" }}
                      src={logoAndBg?.background}
                      alt="background"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {!preview && (
              <Grid item xs={12} sm={6} md={6}>
                <Typography sx={{ mb: 0.5 }} variant="subtitle2">
                  Upload Logo
                </Typography>
                <input
                  id="upload-logo"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(event) => {
                    setUploadedLogo(event.target.files[0]);
                  }}
                />
                <label htmlFor="upload-logo">
                  <Box className="upload-image-container">
                    <Typography>Click to upload image</Typography>
                    <CloudUploadIcon sx={{ color: "#3832a0" }} />
                    <Typography color={"success.main"}>
                      {uploadedLogo?.name}
                    </Typography>
                  </Box>
                </label>
              </Grid>
            )}
            {!preview && (
              <Grid item xs={12} sm={6} md={6}>
                <Typography sx={{ mb: 0.5 }} variant="subtitle2">
                  Upload Favicon
                </Typography>
                <input
                  id="upload-bg"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(event) => {
                    setUploadedBackground(event.target.files[0]);
                  }}
                />
                <label htmlFor="upload-bg">
                  <Box className="upload-image-container">
                    <Typography>Click to upload image</Typography>
                    <CloudUploadIcon sx={{ color: "#3832a0" }} />
                    <Typography color={"success.main"}>
                      {uploadedBackground?.name}
                    </Typography>
                  </Box>
                </label>
              </Grid>
            )}
            {!preview && (
              <Grid item>
                <Button type="submit" variant="outlined">
                  {uploadLoading ? (
                    <CircularProgress size={30} color="info" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default UploadLogoAndBg;
