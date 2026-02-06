import React, { useState, useEffect } from "react";
import "../../../../styles/CustomAudioPlayer.scss";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Download } from "../../../../icons/Download";
import { Box } from "@mui/system";
import { getTimeCodeFromNum } from "../../../Calendar/utils";
const CustomAudioPlayer = ({ openDialog, callRecordingFile }) => {
  const [audio] = useState(new Audio(callRecordingFile));
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!openDialog) {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog]);

  useEffect(() => {
    const updateProgressBar = () => {
      const progressBar = document.querySelector(".audio-progress");
      const progressWidth = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progressWidth}%`;
      setCurrentTime(audio.currentTime);
      if (progressWidth === 100) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    const loadedDataHandler = () => {
      const lengthElement = document.querySelector(".audio-time .audio-length");
      lengthElement.textContent = getTimeCodeFromNum(audio.duration);
      audio.volume = volume;
    };

    audio.addEventListener("timeupdate", updateProgressBar);
    audio.addEventListener("loadeddata", loadedDataHandler);

    return () => {
      audio.removeEventListener("timeupdate", updateProgressBar);
      audio.removeEventListener("loadeddata", loadedDataHandler);
    };
  }, [audio, volume]);

  const playPauseHandler = () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const timelineClickHandler = (e) => {
    const timeline = document.querySelector(".audio-timeline");
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek =
      (e.nativeEvent.offsetX / parseInt(timelineWidth)) * audio.duration;
    audio.currentTime = timeToSeek;
  };

  const volumeSliderClickHandler = (e) => {
    const volumeSlider = document.querySelector(
      ".audio-player-controls .audio-volume-slider"
    );
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.nativeEvent.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const volumeButtonClickHandler = () => {
    audio.muted = !audio.muted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="audio-player">
      <div className="audio-player-controls">
        <div className="audio-play-container">
          <div
            className={`toggle-audio-play ${isPlaying ? "pause" : "play"}`}
            onClick={playPauseHandler}
          ></div>
        </div>
        <div className="audio-time">
          <div className="current-time">{getTimeCodeFromNum(currentTime)}</div>
          <div>/</div>
          <div className="audio-length"></div>
        </div>
        <div className="audio-timeline" onClick={timelineClickHandler}>
          <div className="audio-progress"></div>
        </div>
        <div className="audio-volume-container">
          <div
            className="audio-volume-button"
            onClick={volumeButtonClickHandler}
          >
            {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </div>
          <div
            className="audio-volume-slider"
            onClick={volumeSliderClickHandler}
          >
            <div
              className="audio-volume-percentage"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>
        <Box
          onClick={() => window.open(callRecordingFile)}
          sx={{ cursor: "pointer" }}
        >
          <Download />
        </Box>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
