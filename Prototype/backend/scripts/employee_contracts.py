import sys
import PyPDF2
from openai import OpenAI
from dotenv import load_dotenv
import os
from pathlib import Path
import json



def extract_text_from_pdf(file_path):
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return text
    except FileNotFoundError:
        sys.stderr.write(f"File not found: {file_path}\n")
        return None
    except PyPDF2.errors.PdfReadError as e:
        sys.stderr.write(f"PDF reading error: {str(e)}\n")
        return None
    except Exception as e:
        sys.stderr.write(f"Error while reading file {file_path}: {str(e)}\n")
        return None
        
        # Print the extracted text (it will be captured by the Node.js app)
        # print(f"Extracted text from {file_path}:")
        # print(text)
    
def split_text_into_chunks(text, max_length=2000):
    chunks = []
    current_chunk = ""
    for line in text.splitlines():
        if len(current_chunk) + len(line) <= max_length:
            current_chunk += line + "\n"
        else:
            chunks.append(current_chunk)
            current_chunk = line + "\n"
    if current_chunk:
        chunks.append(current_chunk)
    return chunks

def send_chunk_to_openai(prompt,api_key):
    try:
        client = OpenAI(api_key=api_key)
        # combined_prompt = prompt + "\n\n" + text_chunk
        response = client.chat.completions.create(
            model="gpt-4",  
            messages=[
                {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content
    except Exception as e:
        sys.stderr.write(f"Error during API call to OpenAI: {str(e)}\n")
        return None

def parse_pdf_and_process(pdf_path,api_key):
    section = []
    try:
        text = extract_text_from_pdf(pdf_path)

        if not text:
            raise ValueError("No text extracted from PDF")
        
        chunks = split_text_into_chunks(text)
        for i,chunk in enumerate(chunks):
            prompt = ("Review the following Employee contract section to check if it contains standard elements of an employee contract: "
            "1. Does the PDF contain a confidentiality or non-disclosure clause? Look for language that requires employees to maintain the confidentiality of company information, even after employment ends, "
            "2. Search for any references to access control policies. Does the contract specify employee responsibilities regarding the use of authentication methods, such as login credentials, and any rules about sharing or protecting them?, "
            "3. Check if the document includes a requirement for employees to report security incidents, breaches, or suspicious activities. Are the responsibilities clear for incident detection and reporting?,"
            "4. Does the contract mention compliance with the organization's security policies or procedures? Look for a statement requiring employees to adhere to information security rules and guidelines, "
            "5. Is there any mention of the organization's responsibility to provide information security training to employees? Does the contract specify the need for ongoing security awareness programs?, "
            "6. Find any section that discusses the organization's duty to provide employees with secure access to systems and resources. Are there any references to specific security measures like remote access or secure workstations?,"
            "7. Locate clauses related to intellectual property. Does the contract specify that any work or creations developed by the employee during their employment are the property of the organization?,"
            "8. Is there any mention of data protection laws such as GDPR or other privacy requirements in the contract? Does it state employee obligations regarding the handling of personal or sensitive data?,"
            "9. Search for terms that outline employee obligations after termination, such as returning company property, deleting sensitive data, or maintaining confidentiality after leaving the company,"
            "10. Check if there is a section where the employee acknowledges understanding and agreeing to the terms, especially those related to information security. Is there a space for signatures or formal consent?,"
            "\n\nText:\n" + chunk + "\n\n" + "For each category, list the sub-elements along with a short description present which satisfy the condtion; empty list if there are no sub-elements") 
            response = send_chunk_to_openai(prompt,api_key)
            section.append(response)
            # print(f"Chunk {i+1} of {len(chunks)} processed.")
            # print(response)
        
        # final_summary = "\n".join(summary)
        combined_review_prompt = ("Summarize and assess the following feedback on employee contract sections for a review: Combine the sub-element list and description for each category and check if it satisfies the conditions for the particular category:," 
                                "1. Does the PDF contain a confidentiality or non-disclosure clause? Look for language that requires employees to maintain the confidentiality of company information, even after employment ends, "
                                "2. Search for any references to access control policies. Does the contract specify employee responsibilities regarding the use of authentication methods, such as login credentials, and any rules about sharing or protecting them?," 
                                "3. Check if the document includes a requirement for employees to report security incidents, breaches, or suspicious activities. Are the responsibilities clear for incident detection and reporting?, "
                                "4. Does the contract mention compliance with the organization's security policies or procedures? Look for a statement requiring employees to adhere to information security rules and guidelines,"
                                " 5. Is there any mention of the organization's responsibility to provide information security training to employees? Does the contract specify the need for ongoing security awareness programs?, "
                                "6. Find any section that discusses the organization's duty to provide employees with secure access to systems and resources. Are there any references to specific security measures like remote access or secure workstations?, "
                                "7. Locate clauses related to intellectual property. Does the contract specify that any work or creations developed by the employee during their employment are the property of the organization?, "
                                "8. Is there any mention of data protection laws such as GDPR or other privacy requirements in the contract? Does it state employee obligations regarding the handling of personal or sensitive data?, "
                                "9. Search for terms that outline employee obligations after termination, such as returning company property, deleting sensitive data, or maintaining confidentiality after leaving the company, "
                                "10. Check if there is a section where the employee acknowledges understanding and agreeing to the terms. Is there a space for signatures or formal consent?,"
                                "Write true for each category if the condition is satisfied and false if it is not in a field 'satisfied' Give your answer in the form assessment:[field:satisfied?]  Even if the PDF is off-topic use the same format. Do not add any other text/sentence in the ouput") + "\n".join(section)
        # print(combined_review_prompt)
        response = send_chunk_to_openai(combined_review_prompt,api_key)
        if not response:
            raise ValueError("Failed to process the final summary")
        for conditions in result['assessment']:
            if conditions['satisfied'] == False:
                return "Not Satisfied"
        

        return "Satisfied"
    
        
    
    except Exception as e:
        sys.stderr.write(f"Error processing the PDF and OpenAI API: {str(e)}\n")
        return None


def main():
    try:
        dotenv_path = Path(__file__).resolve().parent.parent / '.env'
        load_dotenv(dotenv_path=dotenv_path)

        api_key = os.getenv('API_KEY')

        if not api_key:
            raise EnvironmentError("API_KEY not found in .env file")

        if len(sys.argv) < 2:
            raise ValueError("File path argument is missing")

        file_path = sys.argv[1]

        result = parse_pdf_and_process(file_path, api_key)
        if result:
            print(result)
        else:
            sys.stderr.write("An error occurred during processing\n")

    except Exception as e:
        sys.stderr.write(f"Error in main function: {str(e)}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
        