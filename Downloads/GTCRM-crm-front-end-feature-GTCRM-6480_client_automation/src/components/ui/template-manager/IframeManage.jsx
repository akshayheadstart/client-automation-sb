import React, { useEffect, useState } from 'react';

const IframeManage = ({ template, index }) => {
    const [frameHeight, setFrameHeight] = useState("")

    useEffect(() => {
        setTimeout(() => {
            let frame = document.getElementById(`myFrame${index}`);
            setFrameHeight(frame?.contentWindow?.document?.body?.scrollHeight + "px")
        }, 200)

    }, [frameHeight, index])

    return (
        <iframe
            onLoad={function () {
                let iFrame = document.getElementById(`myFrame${index}`);
                let iframeBody = iFrame.contentWindow?.document?.body
                iframeBody.style.fontWeight = "bold"
                iframeBody.style.fontSize = "14px"
                iframeBody.style.fontFamily = "Sans-serif"
            }}
            id={`myFrame${index}`}
            style={{ pointerEvents: 'none', minHeight: '350px', maxHeight: '65vh' }}
            width="100%"
            height={frameHeight}
            frameBorder="0"
            scrolling="no"
            title="u"
            srcDoc={template?.content}></iframe>
    );
};
export default IframeManage;
