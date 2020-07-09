import { RequestCustom } from './project_methods';
import { database } from '../index';
export const userUpdate = async (request, res) => {
  const req = request as RequestCustom;
  const userDetails = {
    fullName: req.body.fullName,
    location: req.body.location,
  };
  const reducedDetails: { fullName: any; location: any } = {
    fullName: null,
    location: null,
  };
  if (!isEmpty(userDetails.fullName.trim()))
    reducedDetails.fullName = userDetails.fullName;
  if (!isEmpty(userDetails.location.trim()))
    reducedDetails.location = userDetails.location;
  try {
    await database.doc(`users/${req.user.handle}`).update(reducedDetails);
    return res.status(201).json({ message: 'Details added sucessesfuly.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
export const getUser = async (req, res) => {
  try {
    const user = await database.doc(`/users/${req.params.uid}`).get();
    if (!user.exists)
      return res.status(404).json({ error: 'User does not exist.' });
    return res.status(200).json(user.data());
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
