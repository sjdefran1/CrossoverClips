import axios from "axios";
import { baseRequestURL } from "../index.js";
import fileDownload from "js-file-download";

export const handlePlayDownload = (options) => {
  return new Promise((resolve, reject) => {
    let data = {
      url: options.playUrl,
      ptype: options.play.ptype,
    };

    axios
      .post(baseRequestURL + "/downloadClip", data, { responseType: "blob" })
      .then((res) => {
        const filename = `Q${options.play.quarter}_m${options.play.time.replace(
          ":",
          "-s"
        )}_${options.play.description}.mp4`;
        fileDownload(res.data, filename);

        let update = {
          url: options.playUrl,
          ptype: options.play.ptype,
        };
        axios
          .post(baseRequestURL + "/players/updatePlayDownloadCount", update)
          .then((response) =>
            axios.post(baseRequestURL + "/players/updatePlayViewCount", update)
          )
          .then((response) => resolve(response.data))
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

export const handlePlayView = (play) => {
  let update = {
    url: play.url,
    ptype: play.ptype,
  };
  axios
    .post(baseRequestURL + "/players/updatePlayViewCount", update)
    .then((response) => response.data);
};
