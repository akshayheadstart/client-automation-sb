import styled from "styled-components";

export const Wrapper = styled.div`
  height: 500px;
  margin-top:20px;
  margin-bottom:40px;
`;

export const StyledEvent = styled.span`
  background: ${({ bgColor }) => bgColor};
  color: white;
  text-align: left !important;
  padding: 2px 6px;
  margin: 0 2px;
  border-radius: 3px;
  font-size: 13px;
  text-transform: capitalize;
`;

export const SevenColGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  ${(props) => props.fullheight && `height: calc(100% - 75px);`}
  ${(props) =>
    props.fullheight &&
    `grid-template-rows: repeat(${props.is28Days ? 4 : 5}, 1fr);`}
  div {
    display: grid;
    justify-items: start;
    border: 1px solid #E7E8EA;
    padding-left:5px;
    padding-top:5px;
    ${StyledEvent} {
      display: none;
    }
    ${StyledEvent}:nth-child(-n + 3) {
      display: block;
    }

    span {
      text-align: right;
      padding-right: 15px;
      height: fit-content;
    }

    span.activeDay {
      position: relative;
      color:blue;
    }
     
  }
  div.activeDivDay {
    display: grid;
    justify-items: start;
    border: 1px solid rgba(0, 85, 194, 1);
    padding-left:5px;
    padding-top:5px;
    ${StyledEvent} {
      display: none;
    }
    ${StyledEvent}:nth-child(-n + 3) {
      display: block;
    }
    
    span {
      text-align: right;
      padding-right: 15px;
      height: fit-content;
    }

    span.activeDay {
      position: relative;
      color:blue;
    }
     
  }
`;
// span.active::before {
//   content: "Today ";
//   font-size: 14px;
 
// }
// background-color: pink;
// border-bottom: 2px solid red;
export const HeadDays = styled.span`
  text-align: center;
  border: 1px solid #E7E8EA;
  height: 30px;
  padding: 3px;
  background: white;
  color: black;
  font-weight:800;
  font-size:12px;
`;

export const DateControls = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  align-items: center;

  ion-icon {
    font-size: 1.6rem;
    cursor: pointer;
  }
`;

export const SeeMore = styled.p`
  font-size: 12px;
  padding: 0 5px;
  margin-bottom: 0;
  cursor: pointer;
`;

export const PortalWrapper = styled.div`
  background: white;
  position: absolute;
  width: 60%;
  height: 200px;
  top: 50%;
  left: 50%;
  /* border: 1px solid; */
  border-radius: 6px;
  transform: translate(-50%, -50%);
  box-shadow: 10px 10px 20px black;
  padding: 40px;

  h2 {
    font-size: 3rem;
  }

  ion-icon {
    font-size: 2rem;
    color: red;
    background: lightblue;
    padding: 10px 20px;
    border-radius: 6px;
  }

  p {
    margin-bottom: 15px;
  }

  ion-icon[name="close-outline"] {
    position: absolute;
    top: 10px;
    right: 10px;
    background: red;
    color: lightblue;
  }
`;
