import * as fs from 'fs';
import * as PDFParser from 'pdf-parse';

const unidadeNomeEmail = {
    unidades: {
        'CLINICA MEDICA III HLV' : 'email@email.com',
        'CLINICA MEDICA IIII HLV' : 'email2@email.com'
    }
};

export async function lerPDF(nomeArquivo: string): Promise<string | undefined> {
    try {
        const dataBuffer = fs.readFileSync(nomeArquivo);
        const data = await PDFParser(dataBuffer);

        const textoPDF = data.text;

        // Dividir o texto em linhas e procurar pela linha que contém "clínica:"
        const linhas = textoPDF.split('\n');

        for (const linha of linhas) {
            if (linha.toLowerCase().includes('clínica:')) {
                // Extrair o nome da clínica
                const clinciaNome = linha.split(':').slice(1).map(s => s.trim())[0];
                const emailEncontrado = getEmailFromUnidade(clinciaNome);

                if (emailEncontrado) {
                    return emailEncontrado;
                } else {
                    console.warn(`E-mail não encontrado para a clínica: ${clinciaNome}`);
                }
            }
        }

        return undefined; // Retorna undefined se nenhuma correspondência for encontrada
    } catch (error) {
        console.error('Erro ao ler o arquivo PDF:', error);
        throw error;
    }
}

function getEmailFromUnidade(unidade: string): string | undefined {
    return unidadeNomeEmail.unidades[unidade];
}
