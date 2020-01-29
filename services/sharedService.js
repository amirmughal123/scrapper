import multiparty from 'multiparty';
import s3Service from './s3Service';
import fileType from 'file-type';
import fs from 'fs';

export default {
  isEmptyBody: (obj) => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
      return true;
  },

  uploadImages: function(req, res, next) {
    try {
      const form = new multiparty.Form();
      
      
      form.parse(req, async (error, fields, files) => {
        try {
          let attachment = null;
          let path = '';
          let buffer = '';
          let type = '';
          let timestamp = '';
          let fileName = '';

          if (files[`photo`] && files[`photo`].length > 0 && files[`photo`][0].path) {
            path = files[`photo`][0].path;
            buffer = fs.readFileSync(path);
            timestamp = Date.now().toString();
            fileName = `/PROFILE/${timestamp}`;
            attachment = await s3Service.imageUploadToS3(buffer, fileName, 'public-read');
            attachment = attachment.Location;
          }

          res.send(attachment);
        }
        catch(err) { console.log(err); next(err) }
      })
    }
    catch (err) {
      next(err);  
    }
  },
}
