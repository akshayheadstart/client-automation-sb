import { removeDuplicatesAndSetObjectValues } from "../../helperFunctions/removeDuplicatesAndSetObjectValues"

describe("Test removeDuplicatesAndSetObjectValues function is working or not", () => {
    test('removeDuplicatesAndSetObjectValues function test', () => {

        const keyName = "student_email_id"
        const selectedApplications = [
            {
                "application_id": "6350cf795ecef044334cfb5d",
                "student_id": "6350cf795ecef044334cfb5c",
                "student_name": "Sdsd",
                "custom_application_id": "TAU/2022/BBA/0019",
                "course_name": "BBA",
                "student_email_id": "testredirect@gmail.com",
                "student_mobile_no": 9898989898,
                "payment_status": "",
                "pageNo": 1
            },
            {
                "application_id": "635027c6948653b5e1f8a75c",
                "student_id": "635027c5948653b5e1f8a75b",
                "student_name": "A K H",
                "custom_application_id": "TAU/2022/BScPA/0012",
                "course_name": "BSc in Physician Assistant",
                "student_email_id": "yeliv74104@dicopto.com",
                "student_mobile_no": 1234567890,
                "payment_status": "",
                "pageNo": 1
            },
            {
                "application_id": "635023b6271edbc18bf95edc",
                "student_id": "635023b5271edbc18bf95edb",
                "student_name": "Asdfasd",
                "custom_application_id": "TAU/2022/BScIT/0013",
                "course_name": "BSc in Imaging Technology",
                "student_email_id": "she@gmail.com",
                "student_mobile_no": 4444444444,
                "payment_status": "",
                "pageNo": 1
            },
            {
                "application_id": "6350cf795ecef044334cfb5d",
                "student_id": "6350cf795ecef044334cfb5c",
                "student_name": "Sdsd",
                "custom_application_id": "TAU/2022/BBA/0019",
                "course_name": "BBA",
                "student_email_id": "testredirect@gmail.com",
                "student_mobile_no": 9898989898,
                "payment_status": "",
                "pageNo": 1
            },
        ]

        const result = removeDuplicatesAndSetObjectValues(keyName, selectedApplications)
        const desiredEmail = result.includes("testredirect@gmail.com")
        expect(desiredEmail).toBeTruthy()
    })
})