function useGetCountryAndStateDetails() {
  const getCountryDetails = (countryCode, setCountryDetails) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/countries/${countryCode}/`, {
      headers: {
        accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setCountryDetails(data));
  };
  const getStateDetails = (
    countryCode,
    stateCode,
    setStateDetails,
    setSelectedStateCode
  ) => {
    fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/countries/${countryCode}/states/${stateCode}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setStateDetails(data);
        setSelectedStateCode && setSelectedStateCode(data?.state_code);
      });
  };
  return { getCountryDetails, getStateDetails };
}

export default useGetCountryAndStateDetails;
