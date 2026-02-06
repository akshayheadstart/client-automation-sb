import React from "react";

function ProgressBar(props) {
    const { bgcolor, progress, height } = props;
    const Parentdiv = {
        height: height,
        width: "100%",
        backgroundColor: '#d9dbda',
        borderRadius: 40,
    };

    const Childdiv = {
        height: height,
        width: `${progress}%`,
        backgroundColor: bgcolor,
        borderRadius: 40,
        textAlign: "center",
    };

    const progresstext = {
        padding: 10,
        color: "white",
        fontWeight: 500,
        fontSize: 13,
        position: "relative",
        top: "-6px",
    };
    return (
        <div style={Parentdiv}>
            <div style={Childdiv}>
                <span style={progresstext}>{`${progress}%`}</span>
            </div>
        </div>
    );
}

export default ProgressBar;