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

def send_chunk_to_openai(prompt, api_key):
    try:
        client = OpenAI(api_key=api_key)
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

def parse_pdf_and_check_6_5(pdf_path, api_key):
    sections = []
    try:
        text = extract_text_from_pdf(pdf_path)

        if not text:
            raise ValueError("No text extracted from PDF")

        chunks = split_text_into_chunks(text)
        for i, chunk in enumerate(chunks):
            prompt = (
                "Review the following employee contract section to check for the following conditions: "
                "1. Does the section outline the responsibilities of employees to maintain information security even after their employment or role changes? "
                "2. Are there clauses specifying the return of company property, deletion of sensitive data, or continued confidentiality obligations post-termination? "
                "3. Does it mention any processes or responsibilities that remain valid after the employment or agreement has ended? "
                "4. Are these responsibilities clearly defined and communicated to relevant personnel? "
                "\n\nText:\n" + chunk + "\n\n"
                "For each category, list the sub-elements along with a short description present which satisfy the condtion; empty list if there are no sub-elements"
            )
            response = send_chunk_to_openai(prompt, api_key)
            sections.append(response)

        combined_review_prompt = (
            "Summarize the following feedback on employee contract sections to confirm if they satisfy these conditions: "
            "1. Does the section outline the responsibilities of employees to maintain information security even after their employment or role changes? "
            "2. Are there clauses specifying the return of company property, deletion of sensitive data, or continued confidentiality obligations post-termination? "
            "3. Does it mention any processes or responsibilities that remain valid after the employment or agreement has ended? "
            "4. Are these responsibilities clearly defined and communicated to relevant personnel? "
            "Write true for each category if the condition is satisfied and false if it is not in a field 'satisfied' Give your answer strictly in the form  assessment:[field:satisfied?]' Even if the it is off-topic use the same format. Do not add any other text/sentence in the ouput"
        ) + "\n".join(sections)
        
        response = send_chunk_to_openai(combined_review_prompt, api_key)
        if not response:
            raise ValueError("Failed to process the final summary")
        print(response)
        result = json.loads(response)
        for condition in result['assessment']:
            if condition['satisfied'] == False:
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

        result = parse_pdf_and_check_6_5(file_path, api_key)
        if result:
            print(result)
        else:
            sys.stderr.write("An error occurred during processing\n")

    except Exception as e:
        sys.stderr.write(f"Error in main function: {str(e)}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
