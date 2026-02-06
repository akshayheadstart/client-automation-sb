import { Button, IconButton, Popover, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import "./../../styles/EmailTemplateBuilder.css";
import CloseIcon from '@mui/icons-material/Close';

const TemplatesTutorial = ({
    allTemplateTutorialId,
    allTemplateTutorialOpen,
    allTemplateTutorial,
    skipTutorial,
    handleAllTemplatesTutorialNext,
    yourTemplatesTutorial,
    handleYourTemplatesTutorialNext,
    yourTemplatesTutorialOpen,
    yourTemplatesTutorialId,
    handleYourTemplatesTutorialBack,
    draftTemplatesTutorialId,
    draftTemplatesTutorialOpen,
    draftTemplatesTutorial,
    handleDraftTemplatesTutorialNext,
    handleDraftTemplatesTutorialBack,
    searchTemplatesTutorialId,
    searchTemplatesTutorialOpen,
    searchTemplatesTutorial,
    handleSearchTemplatesTutorialNext,
    handleSearchTemplatesTutorialBack,
    createTemplatesTutorialId,
    createTemplatesTutorialOpen,
    createTemplatesTutorial,
    handleCreateTemplatesTutorialBack,
    allTemplate,


    defaultTemplatesTutorialOpen,
    defaultTemplatesTutorialId,
    defaultTemplatesTutorial,
    handleDefaultTemplatesTutorialNext,
    handleDefaultTemplatesTutorialBack
}) => {

    const popoverTutorialBackground = '#6686D7';

    return (
        <>
            {/* All templates popover tutorial */}
            <Popover
                id={allTemplateTutorialId}
                open={allTemplateTutorialOpen}
                anchorEl={allTemplateTutorial}
                anchorOrigin={{
                    horizontal: "left"
                }}
                sx={{
                    marginLeft: { xs: "0px", sm: "80px", md: "0px", lg: "60px" },
                }}
                PaperProps={{
                    style: {
                        boxShadow: "none",
                        borderRadius: 0,
                        marginTop: 208,
                    }
                }}
            >
                <Box
                    className="all-templates-tutorial-arrow"
                    sx={{
                        borderRadius: 10,
                        position: "relative",
                        mt: "10px",
                        "&::before": {
                            backgroundColor: popoverTutorialBackground,
                            content: '""',
                            display: "block",
                            position: "absolute",
                            width: 12,
                            height: 12,
                            top: -6,
                            transform: "rotate(45deg)",
                            left: "calc(10% - 6px)",
                        }
                    }}
                />
                <div style={{ width: 250, backgroundColor: popoverTutorialBackground, borderRadius: 8 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pl: 2, pt: 1 }}>
                        <Typography variant="h6" className="overly-tutorial-title">See All Templates</Typography>
                        <IconButton size="small" sx={{ margin: "0px" }} onClick={skipTutorial} data-testid="tutorial-skip-button">
                            <CloseIcon className="email-layout-overly-tutorials-close-button" />
                        </IconButton>
                    </Box>
                    <Typography sx={{ px: 2, pb: 1 }} variant='body2' color='white'>
                        All Templates represents all the existing templates. You can use these templates in the editor.
                    </Typography>

                    <Box sx={{
                        pb: 1, px: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Typography variant='body2' color='white'>1 of 5</Typography>
                        <Button data-testid="all-templates-tutorial-next-button" variant="contained" size="small" onClick={handleAllTemplatesTutorialNext} className="email-layout-overly-tutorials-button">
                            Next
                        </Button>
                    </Box>
                </div>
            </Popover>

            {/* Your templates popover tutorial */}
            <Popover
                data-testid="your-templates-tutorial"
                id={yourTemplatesTutorialId}
                open={yourTemplatesTutorialOpen}
                anchorEl={yourTemplatesTutorial}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "top"
                }}
                sx={{
                    marginLeft: { xs: "0px", sm: "250px", md: "200px", lg: "250px" },
                }}
                PaperProps={{
                    style: {
                        boxShadow: "none",
                        borderRadius: 5,
                        marginTop: 210,
                    }
                }}
            >
                <Box
                    className="your-templates-tutorial-arrow"
                />
                <div style={{ width: 270, backgroundColor: popoverTutorialBackground, borderRadius: 8 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pl: 2, pt: 1 }}>
                        <Typography variant="h6" className="overly-tutorial-title">See Your Templates</Typography>
                        <IconButton size="small" sx={{ margin: "0px" }} onClick={skipTutorial}>
                            <CloseIcon className="email-layout-overly-tutorials-close-button" />
                        </IconButton>
                    </Box>
                    <Typography sx={{ px: 2, pb: 1 }} variant='body2' color='white'>
                        Your Templates shows all the templates you have created. You can use these templates in the editor</Typography>
                    <Box sx={{
                        pb: 1, px: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Typography variant='body2' color='white'>2 of 5</Typography>
                        <Box>
                            <Button data-testid="your-templates-tutorial-next-button" variant="contained" size="small" onClick={handleYourTemplatesTutorialBack} className="email-layout-overly-tutorials-button" sx={{ mr: "5px" }}>
                                Back
                            </Button>
                            <Button data-testid="your-templates-tutorial-next-button" variant="contained" size="small" onClick={handleYourTemplatesTutorialNext} className="email-layout-overly-tutorials-button">
                                Next
                            </Button>
                        </Box>
                    </Box>
                </div>
            </Popover>


            {/* Draft templates popover tutorial */}
            <Popover
                data-testid="draft-templates-tutorial"
                id={draftTemplatesTutorialId}
                open={draftTemplatesTutorialOpen}
                anchorEl={draftTemplatesTutorial}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "top"
                }}
                transformOrigin={{
                    vertical: 'right',
                    horizontal: 700,
                }}
                className='draft-templates-popover-tutorial'
                sx={{
                    marginLeft: { xs: "95px", sm: "400px", md: "250px", lg: "250px" },
                }}
                PaperProps={{
                    style: {
                        boxShadow: "none",
                        borderRadius: 5,
                        marginTop: 210,
                    }
                }}
            >
                <Box
                    className="draft-templates-tutorial-arrow"
                    sx={{
                        position: "relative",
                        mt: "10px",
                        "&::before": {
                            backgroundColor: popoverTutorialBackground,
                            content: '""',
                            display: "block",
                            position: "absolute",
                            width: 12,
                            height: 12,
                            top: -6,
                            transform: "rotate(45deg)",
                            right: "calc(10% - 6px)",
                        }
                    }}
                />
                <div style={{ width: 250, backgroundColor: popoverTutorialBackground, borderRadius: 8 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pl: 2, pt: 1 }}>
                        <Typography variant="h6" className="overly-tutorial-title">See Draft Templates</Typography>
                        <IconButton size="small" sx={{ margin: "0px" }} onClick={skipTutorial}>
                            <CloseIcon className="email-layout-overly-tutorials-close-button" />
                        </IconButton>
                    </Box>
                    <Typography sx={{ px: 2, pb: 1 }} variant='body2' color='white'>
                        Draft Templates shows all the unpublished templates. You can use these templates in the editor.</Typography>
                    <Box sx={{
                        pb: 1, px: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Typography variant='body2' color='white'>3 of 5</Typography>
                        <Box>
                            <Button variant="contained" size="small" onClick={handleDraftTemplatesTutorialBack} className="email-layout-overly-tutorials-button" sx={{ mr: "5px" }}>
                                Back
                            </Button>
                            <Button variant="contained" size="small" onClick={handleDraftTemplatesTutorialNext} className="email-layout-overly-tutorials-button">
                                Next
                            </Button>
                        </Box>
                    </Box>
                </div>
            </Popover>

            {/* Default templates popover tutorial */}
            <Popover
                data-testid="default-templates-tutorial"
                id={defaultTemplatesTutorialId}
                open={defaultTemplatesTutorialOpen}
                anchorEl={defaultTemplatesTutorial}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "top"
                }}
                transformOrigin={{
                    vertical: 'right',
                    horizontal: 700,
                }}
                className='default-templates-popover-tutorial'
                sx={{
                    marginLeft: { xs: "95px", sm: "400px", md: "250px", lg: "250px" },
                }}
                PaperProps={{
                    style: {
                        boxShadow: "none",
                        borderRadius: 5,
                        marginTop: 210,
                    }
                }}
            >
                <Box
                    className="default-templates-tutorial-arrow"
                    sx={{
                        position: "relative",
                        mt: "10px",
                        "&::before": {
                            backgroundColor: popoverTutorialBackground,
                            content: '""',
                            display: "block",
                            position: "absolute",
                            width: 12,
                            height: 12,
                            top: -6,
                            // left: "230px",
                            transform: "rotate(45deg)",
                            right: "calc(50% - 6px)",
                        }
                    }}
                />
                <div style={{ width: 250, backgroundColor: popoverTutorialBackground, borderRadius: 8 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pl: 2, pt: 1 }}>
                        <Typography variant="h6" className="overly-tutorial-title">See Default Templates</Typography>
                        <IconButton size="small" sx={{ margin: "0px" }} onClick={skipTutorial}>
                            <CloseIcon className="email-layout-overly-tutorials-close-button" />
                        </IconButton>
                    </Box>
                    <Typography sx={{ px: 2, pb: 1 }} variant='body2' color='white'>
                        Default Templates shows all the unpublished templates. You can use these templates in the editor.</Typography>
                    <Box sx={{
                        pb: 1, px: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Typography variant='body2' color='white'>3 of 5</Typography>
                        <Box>
                            <Button variant="contained" size="small" onClick={handleDefaultTemplatesTutorialBack} className="email-layout-overly-tutorials-button" sx={{ mr: "5px" }}>
                                Back
                            </Button>
                            <Button variant="contained" size="small" onClick={handleDefaultTemplatesTutorialNext} className="email-layout-overly-tutorials-button">
                                Next
                            </Button>
                        </Box>
                    </Box>
                </div>
            </Popover>

            {/* Search by tag name templates popover tutorial */}

            <Popover
                id={searchTemplatesTutorialId}
                open={searchTemplatesTutorialOpen}
                anchorEl={searchTemplatesTutorial}
                anchorOrigin={{
                    horizontal: "right"
                }}
                transformOrigin={{ horizontal: 500 }}
                sx={{
                    marginTop: { xs: "290px", md: "220px", }
                }}
                PaperProps={{
                    style: {
                        boxShadow: "none",
                        borderRadius: "none",
                    }
                }}
                className="popover-tutorial-email-editor"
            >
                <Box className="search-templates-tutorial-arrow"
                    sx={{
                        position: "relative",
                        mt: "10px",
                        "&::before": {
                            backgroundColor: popoverTutorialBackground,
                            content: '""',
                            display: "block",
                            position: "absolute",
                            width: 12,
                            height: 12,
                            top: -6,
                            transform: "rotate(45deg)",
                            right: "calc(8% - 6px)",
                        }
                    }}
                />
                <div style={{ width: 250, backgroundColor: popoverTutorialBackground, borderRadius: 8 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pl: 2, pt: 1 }}>
                        <Typography variant="h6" className="overly-tutorial-title">Search Templates</Typography>
                        <IconButton size="small" sx={{ margin: "0px" }} onClick={skipTutorial}>
                            <CloseIcon className="email-layout-overly-tutorials-close-button" />
                        </IconButton>
                    </Box>
                    <Typography sx={{ px: 2, pb: 1 }} variant='body2' color='white'>
                        Here you can search for any existing templates by tags name. Input tags name and press enter to search.
                    </Typography>

                    <Box sx={{
                        pb: 1, px: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Typography variant='body2' color='white'>4 of 5</Typography>
                        <Box>
                            <Button variant="contained" size="small" onClick={handleSearchTemplatesTutorialBack} className="email-layout-overly-tutorials-button" sx={{ mr: "5px" }}>
                                Back
                            </Button>
                            <Button variant="contained" size="small" onClick={handleSearchTemplatesTutorialNext} className="email-layout-overly-tutorials-button">
                                Next
                            </Button>
                        </Box>
                    </Box>
                </div>
            </Popover>

            {/* create templates popover tutorial */}
            <Popover
                id={createTemplatesTutorialId}
                open={createTemplatesTutorialOpen}
                anchorEl={createTemplatesTutorial}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "top"
                }}
                className={`
                    ${allTemplate?.length === 0 && "create-templates-overlay-tutorial"}
                    ${allTemplate?.length === 1 && "create-templates-overlay-tutorial_when_one_template"}
                    ${allTemplate?.length === 2 && "create-templates-overlay-tutorial_when_two_template"}
                    ${allTemplate?.length === 3 && "create-templates-overlay-tutorial_when_three_template"}
                    ${allTemplate?.length === 4 && "create-templates-overlay-tutorial_when_four_template"} 
                    ${allTemplate?.length > 4 && "create-templates-overlay-tutorial_when_five_template"} 
                    `}
                sx={{
                    // marginLeft: { xs: "0px", sm: "100px", md: "100px", lg: "210px" },
                    // marginTop: { xs: "190px", md: "100px", }
                }}
                PaperProps={{
                    style: {
                        boxShadow: "none",
                        borderRadius: 5,
                    }
                }}
            >
                <div style={{ width: 250, backgroundColor: popoverTutorialBackground, borderRadius: 8 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pl: 2, pt: 1 }}>
                        <Typography variant="h6" className="overly-tutorial-title">Create Templates</Typography>
                        <IconButton size="small" sx={{ margin: "0px" }} onClick={skipTutorial}>
                            <CloseIcon className="email-layout-overly-tutorials-close-button" />
                        </IconButton>
                    </Box>
                    <Typography sx={{ px: 2, pb: 1 }} variant='body2' color='white'>
                        You can create a new template from here. Click on the 'Create from scratch' to create a new template.
                    </Typography>

                    <Box sx={{
                        pb: 1, px: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Typography variant='body2' color='white'>5 of 5</Typography>
                        <Button variant="contained" size="small" onClick={handleCreateTemplatesTutorialBack} className="email-layout-overly-tutorials-button">
                            Back
                        </Button>
                    </Box>
                </div>
                <Box
                    sx={{
                        position: "relative",
                        mt: "10px",
                        "&::before": {
                            backgroundColor: popoverTutorialBackground,
                            content: '""',
                            display: "block",
                            position: "absolute",
                            width: 12,
                            height: 12,
                            top: -16,
                            transform: "rotate(45deg)",
                            right: "calc(50% - 6px)",
                        }
                    }}
                />
            </Popover>
        </>
    );
};

export default TemplatesTutorial;