//IMPORT
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fichaSchema = new Schema({
  atendimento: {
    centro_atendimento: { type: String },
    ficha: {
      tipo_ficha: { type: String },
      exposicao: { type: String },
      data_ficha: { type: String },
      hora_ficha: { type: String },
    },
    data_atendimento: { type: String },
    horario_atendimento: { type: String },
    meio_atendimento: { type: String },
    local_atendimento: { type: String },
    responsavel_atendimento: { type: String },
    responsavel_revisao: { type: String },
    responsavel_supervisao: { type: String },
    controle_centro: { type: String },
  },

  solicitante: {
    categoria_multiple_select: { type: Array },
    nome_solicitante: { type: String },
    uf_solicitante: { type: String },
    municipio_solicitante: { type: String },
    fone_solicitante: { type: String },
    instituicao_solicitante: { type: String },
  },

  paciente: {
    nome_paciente: { type: String },
    gestante_select_paciente: { type: String },
    raca_cor_paciente: { type: String },
    escolaridade_paciente: { type: String },
    ocupacao_paciente: { type: String },
    data_nascimento_paciente: { type: String },
    idade_paciente: { type: String },
    peso_paciente: { type: String },
    sexo_paciente: { type: String },
    endereco: {
      pais_paciente: { type: String },
      municipio_paciente: { type: String },
      cep_paciente: { type: String },
      bairro_paciente: { type: String },
      logradouro_paciente: { type: String },
      numero_casa_paciente: { type: String },
      complemento_casa_paciente: { type: String },
    },
    telefone_paciente: { type: String },
    nome_mae_paciente: { type: String },
    prontuario_paciente: { type: String },
    cpf_paciente: { type: String },
    rg_paciente: { type: String },
    cartao_sus_paciente: { type: String },
    convenio_paciente: { type: String },
  },

  agenteToxico: {
    agente1: {
      nome: { type: String },
      substancia_Genero: { type: String },
      subclasse: { type: String },
      classe: { type: String },
      grupo: { type: String },
    },
    agente2: {
      nome: { type: String },
      substancia_Genero: { type: String },
      subclasse: { type: String },
      classe: { type: String },
      grupo: { type: String },
    },
    agente3: {
      nome: { type: String },
      substancia_Genero: { type: String },
      subclasse: { type: String },
      classe: { type: String },
      grupo: { type: String },
    },
    dados_complementares: { type: String },
    quantidade_apresentacao: { type: String },
    dose: { type: String },
  },

  exposicao: {
    data: { type: String },
    horario: { type: String },
    tempo_decorrido: { type: String },
    duracao_exposicao: { type: String },
    especificar_mordida: { type: String },
    tipos: {
      tipo_exposicao: { type: Array },
      local_exposicao: { type: Array },
      zona_exposicao: { type: Array },
      via_de_exposicao: { type: Array },
      circunstancia_de_exposicao: { type: Array },
      local_mordida: { type: Array },
    },
    endereco: {
      pais: { type: String },
      estado: { type: String },
      municipio: { type: String },
      cep: { type: String },
      bairro: { type: String },
      logradouro: { type: String },
      numero: { type: String },
      complemento: { type: String },
      fone: { type: String },
    },
  },

  outrasInformacoes: {
    classificacao_gravidade: { type: String },
    manifestacoesClinicas: {
      manifestacao: { type: String },
      sinais_sintomas: { type: String },
    },
    tratamento: {
      medida_tomada: { type: String },
      medida_orientada: { type: String },
      medida_realizada: { type: String },
      informacoes_adicionais: { type: String },
      exames_resultados_lab: { type: String },
    },
    historia: { type: String },
    fonte: { type: String },
    complemento: { type: String },
    imagens: { type: String },
    observacoes: { type: String },
  },

  acompanhamento: {
    dados: [
      {
        data_hora: { type: String },
        responsavel: { type: String },
        evolucao: { type: String },
        informante: { type: String },
        instituicao: { type: String },
        cidade: { type: String },
        fone: { type: String },
      },
    ],
  },

  classificacaoFinal: {
    classificacao_gravidade_final: { type: String },
    desfecho: { type: String },
    obito: { type: String },
    data: { type: String },
    autopsia: { type: String },
    resultado_autopsia: { type: String },
    contribuicao_obito: { type: String },
  },

  // title: { type: String, required: true },

  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('tccFichas', fichaSchema);
