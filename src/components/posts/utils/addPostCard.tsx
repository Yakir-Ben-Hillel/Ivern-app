import {
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Typography
} from '@material-ui/core';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import React from 'react';
import { useStyles } from '../postsManager';
interface IProps {
  imageURL: string | undefined;
  setImageURL: React.Dispatch<React.SetStateAction<string>>;
}
const AddPostCard: React.FC<IProps> = ({ imageURL, setImageURL }) => {
  const [imageLoading, setImageLoading] = React.useState<boolean>(false);
  const imageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.files) {
        const formData = new FormData();
        const newFile = event.target.files[0];
        formData.append('image', newFile);
        setImageLoading(true);
        const res = await axios.post(
          'https://europe-west3-ivern-app.cloudfunctions.net/api/image',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        const resImageURL: string = res.data.imageURL;
        setImageURL(resImageURL);
        setImageLoading(false);
        return resImageURL;
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const classes = useStyles();
  return (
    <div>
      <Card>
        <CardActionArea style={{ marginBottom: '10px' }}>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            type="file"
            onChange={imageUpload}
          />
          <label htmlFor="contained-button-file">
            <CardContent className={classes.cardAction}>
              {imageLoading ? (
                <CircularProgress size={60} />
              ) : imageURL && !imageURL.includes('igdb') ? (
                <div>
                  <img width="100%" height="300px" src={imageURL} alt="" />
                </div>
              ) : (
                <div>
                  <CloudUploadOutlinedIcon fontSize="large" />
                  <Typography variant="h6" color="textSecondary">
                    Click to upload an image
                  </Typography>
                </div>
              )}
            </CardContent>
          </label>
        </CardActionArea>
        <Alert severity="info">
          The game cover will be used if a picture isn't provided.
        </Alert>
      </Card>
    </div>
  );
};
export default AddPostCard;
