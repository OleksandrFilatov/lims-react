import { combineReducers } from '@reduxjs/toolkit';
import { reducer as userTypeReducer } from '../slices/userType';
import { reducer as authReducer } from '../slices/auth';
import { reducer as userReducer } from '../slices/user';
import { reducer as packingTypeReducer } from '../slices/packingType';
import { reducer as unitReducer } from '../slices/unit';
import { reducer as objectiveReducer } from '../slices/objective';
import { reducer as analysisTypeReducer } from '../slices/analysisType';
import { reducer as clientReducer } from '../slices/client';
import { reducer as reasonReducer } from '../slices/reason';
import { reducer as sampleTypeReducer } from '../slices/sampleType';
import { reducer as materialReducer } from '../slices/material';
import { reducer as certificateTemplateReducer } from '../slices/certificateTemplate';
import { reducer as certificateTypeReducer } from '../slices/certificateType';
import { reducer as laboratoryReducer } from '../slices/laboratory';
import { reducer as settingReducer } from '../slices/setting';
import { reducer as oreTypeReducer } from '../slices/oreType';
import { reducer as geologyReducer } from '../slices/geology';

export const rootReducer = combineReducers({
  userType: userTypeReducer,
  auth: authReducer,
  user: userReducer,
  packingType: packingTypeReducer,
  unit: unitReducer,
  objective: objectiveReducer,
  analysisType: analysisTypeReducer,
  client: clientReducer,
  reason: reasonReducer,
  sampleType: sampleTypeReducer,
  material: materialReducer,
  certificateTemplate: certificateTemplateReducer,
  certificateType: certificateTypeReducer,
  laboratory: laboratoryReducer,
  setting: settingReducer,
  oreType: oreTypeReducer,
  geology: geologyReducer
});
