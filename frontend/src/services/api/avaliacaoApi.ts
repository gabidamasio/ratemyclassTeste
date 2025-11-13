import { api } from './avaliacao';
import { AvaliacaoProfessor, AvaliacaoDisciplina, AvaliacaoCoordenador } from '../../types/avaliacao';

// Tipo estendido para mock (inclui id e campos de metadados)
interface AvaliacaoProfessorComId extends AvaliacaoProfessor {
  id: number;
  active?: boolean;
  createdAt?: string;
}

// Carregar dados do localStorage ou usar defaults
const getInitialMockData = (): Record<number, AvaliacaoProfessorComId> => {
  try {
    const stored = localStorage.getItem('mockAvaliacoes');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.warn('Erro ao carregar dados do localStorage:', err);
  }

  // Dados padrão
  return {
    1: {
      id: 1,
      professorId: 1,
      didatica: 8,
      qualidadeAula: 9,
      flexibilidade: 7,
      organizacao: 8,
      comentario: 'Ótimo professor, muito atencioso com os alunos',
      visibilidade: 'publica',
      active: true,
      createdAt: '2025-11-10T10:30:00',
    },
    2: {
      id: 2,
      professorId: 2,
      didatica: 6,
      qualidadeAula: 7,
      flexibilidade: 5,
      organizacao: 6,
      comentario: 'Aulas interessantes, mas falta mais prática',
      visibilidade: 'privada',
      active: true,
      createdAt: '2025-11-09T14:15:00',
    },
  };
};

// Mock data com persistência
let mockAvaliacoes = getInitialMockData();

// Salvar dados no localStorage
const saveMockData = () => {
  try {
    localStorage.setItem('mockAvaliacoes', JSON.stringify(mockAvaliacoes));
  } catch (err) {
    console.warn('Erro ao salvar dados no localStorage:', err);
  }
};

// Gerar novo ID
const getNextId = (): number => {
  const ids = Object.keys(mockAvaliacoes).map(k => parseInt(k));
  return Math.max(...ids, 0) + 1;
};

export const avaliacaoApi = {
  cadastrarAvaliacao: async (avaliacao: AvaliacaoProfessor) => {
    try {
      const response = await api.post('/avaliacoes/professor', avaliacao);
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn('API indisponível, usando mock para criar avaliação');
      const newId = getNextId();
      const newAvaliacao: AvaliacaoProfessorComId = {
        id: newId,
        ...avaliacao,
        active: true,
        createdAt: new Date().toISOString(),
      };
      mockAvaliacoes[newId] = newAvaliacao;
      saveMockData();
      return { success: true, message: 'Avaliação criada com sucesso (mock)', id: newId };
    }
  },

  listarAvaliacoes: async () => {
    try {
      const response = await api.get('/avaliacoes/professor');
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn('API indisponível, usando mock para listar avaliações');
      return Object.values(mockAvaliacoes);
    }
  },

  buscarAvaliacaoPorId: async (id: number) => {
    try {
      const response = await api.get(`/avaliacoes/professor/${id}`);
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn(`API indisponível, usando mock para buscar avaliação ${id}`);
      const mock = mockAvaliacoes[id];
      if (!mock) throw new Error(`Avaliação ${id} não encontrada`);
      return mock;
    }
  },

  atualizarAvaliacao: async (id: number, avaliacao: Partial<AvaliacaoProfessor>) => {
    try {
      const response = await api.put(`/avaliacoes/professor/${id}`, avaliacao);
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn(`API indisponível, usando mock para atualizar avaliação ${id}`);
      if (mockAvaliacoes[id]) {
        mockAvaliacoes[id] = { ...mockAvaliacoes[id], ...avaliacao };
        saveMockData();
        return { success: true, message: 'Avaliação atualizada com sucesso (mock)' };
      }
      throw new Error(`Avaliação ${id} não encontrada`);
    }
  },

  excluirAvaliacao: async (id: number) => {
    try {
      const response = await api.delete(`/avaliacoes/professor/${id}`);
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn(`API indisponível, usando mock para deletar avaliação ${id}`);
      if (mockAvaliacoes[id]) {
        delete mockAvaliacoes[id];
        saveMockData();
        return { success: true, message: 'Avaliação deletada com sucesso (mock)' };
      }
      throw new Error(`Avaliação ${id} não encontrada`);
    }
  },
};

export const avaliacaoApiDisciplina = {
  cadastrarAvaliacao: async (avaliacao: AvaliacaoDisciplina) => {
    try {
      const response = await api.post('/avaliacoes/disciplina', avaliacao);
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn('API indisponível, usando mock para criar avaliação de disciplina');
      const newId = getNextId();
      const newAvaliacao = {
        id: newId,
        ...avaliacao,
        active: true,
        createdAt: new Date().toISOString(),
      };
      const stored = localStorage.getItem('mockAvaliacoesDisciplina');
      const mockDisciplinas = stored ? JSON.parse(stored) : {};
      mockDisciplinas[newId] = newAvaliacao;
      localStorage.setItem('mockAvaliacoesDisciplina', JSON.stringify(mockDisciplinas));
      return { success: true, message: 'Avaliação de disciplina criada com sucesso (mock)', id: newId };
    }
  },

  listarAvaliacoes: async () => {
    try {
      const response = await api.get('/avaliacoes/disciplina');
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn('API indisponível, usando mock para listar avaliações de disciplina');
      const stored = localStorage.getItem('mockAvaliacoesDisciplina');
      if (stored) {
        return Object.values(JSON.parse(stored));
      }
      // Dados padrão
      return [
        {
          id: 1,
          disciplinaId: 1,
          dificuldade: 7,
          metodologia: 8,
          conteudos: 9,
          aplicabilidade: 8,
          comentario: 'Disciplina desafiadora mas muito útil',
          visibilidade: 'publica',
          active: true,
          createdAt: '2025-11-08T09:15:00',
        },
      ];
    }
  },

  excluirAvaliacao: async (id: number) => {
    try {
      const response = await api.delete(`/avaliacoes/disciplina/${id}`);
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn('API indisponível, usando mock para deletar avaliação de disciplina');
      const stored = localStorage.getItem('mockAvaliacoesDisciplina');
      if (stored) {
        const mockDisciplinas = JSON.parse(stored);
        delete mockDisciplinas[id];
        localStorage.setItem('mockAvaliacoesDisciplina', JSON.stringify(mockDisciplinas));
      }
      return { success: true, message: 'Avaliação de disciplina deletada com sucesso (mock)' };
    }
  },

  buscarAvaliacaoPorId: async (id: number) => {
    try {
      const response = await api.get(`/avaliacoes/disciplina/${id}`);
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn(`API indisponível, usando mock para buscar avaliação de disciplina ${id}`);
      const stored = localStorage.getItem('mockAvaliacoesDisciplina');
      if (stored) {
        const mockDisciplinas = JSON.parse(stored);
        if (mockDisciplinas[id]) return mockDisciplinas[id];
      }
      throw new Error(`Avaliação de disciplina ${id} não encontrada`);
    }
  },

  atualizarAvaliacao: async (id: number, avaliacao: Partial<AvaliacaoDisciplina>) => {
    try {
      const response = await api.put(`/avaliacoes/disciplina/${id}`, avaliacao);
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn(`API indisponível, usando mock para atualizar avaliação de disciplina ${id}`);
      const stored = localStorage.getItem('mockAvaliacoesDisciplina');
      if (stored) {
        const mockDisciplinas = JSON.parse(stored);
        if (mockDisciplinas[id]) {
          mockDisciplinas[id] = { ...mockDisciplinas[id], ...avaliacao };
          localStorage.setItem('mockAvaliacoesDisciplina', JSON.stringify(mockDisciplinas));
          return { success: true, message: 'Avaliação de disciplina atualizada com sucesso (mock)' };
        }
      }
      throw new Error(`Avaliação de disciplina ${id} não encontrada`);
    }
  },
};

export const avaliacaoApiCoordenador = {
  cadastrarAvaliacao: async (avaliacao: AvaliacaoCoordenador) => {
    try {
      const response = await api.post('/avaliacoes/coordenador', avaliacao);
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn('API indisponível, usando mock para criar avaliação de coordenador');
      const newId = getNextId();
      const newAvaliacao = {
        id: newId,
        ...avaliacao,
        active: true,
        createdAt: new Date().toISOString(),
      };
      const stored = localStorage.getItem('mockAvaliacoesCoordenador');
      const mockCoordenadores = stored ? JSON.parse(stored) : {};
      mockCoordenadores[newId] = newAvaliacao;
      localStorage.setItem('mockAvaliacoesCoordenador', JSON.stringify(mockCoordenadores));
      return { success: true, message: 'Avaliação de coordenador criada com sucesso (mock)', id: newId };
    }
  },

  listarAvaliacoes: async () => {
    try {
      const response = await api.get('/avaliacoes/coordenador');
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn('API indisponível, usando mock para listar avaliações de coordenador');
      const stored = localStorage.getItem('mockAvaliacoesCoordenador');
      if (stored) {
        return Object.values(JSON.parse(stored));
      }
      // Dados padrão
      return [
        {
          id: 1,
          coordenadorId: 1,
          transparencia: 7,
          interacaoAluno: 8,
          suporte: 7,
          organizacao: 8,
          comentario: 'Coordenação acessível e responsiva',
          visibilidade: 'publica',
          active: true,
          createdAt: '2025-11-07T14:30:00',
        },
      ];
    }
  },

  excluirAvaliacao: async (id: number) => {
    try {
      const response = await api.delete(`/avaliacoes/coordenador/${id}`);
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn('API indisponível, usando mock para deletar avaliação de coordenador');
      const stored = localStorage.getItem('mockAvaliacoesCoordenador');
      if (stored) {
        const mockCoordenadores = JSON.parse(stored);
        delete mockCoordenadores[id];
        localStorage.setItem('mockAvaliacoesCoordenador', JSON.stringify(mockCoordenadores));
      }
      return { success: true, message: 'Avaliação de coordenador deletada com sucesso (mock)' };
    }
  },

  buscarAvaliacaoPorId: async (id: number) => {
    try {
      const response = await api.get(`/avaliacoes/coordenador/${id}`);
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn(`API indisponível, usando mock para buscar avaliação de coordenador ${id}`);
      const stored = localStorage.getItem('mockAvaliacoesCoordenador');
      if (stored) {
        const mockCoordenadores = JSON.parse(stored);
        if (mockCoordenadores[id]) return mockCoordenadores[id];
      }
      throw new Error(`Avaliação de coordenador ${id} não encontrada`);
    }
  },

  atualizarAvaliacao: async (id: number, avaliacao: Partial<AvaliacaoCoordenador>) => {
    try {
      const response = await api.put(`/avaliacoes/coordenador/${id}`, avaliacao);
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão
      console.warn(`API indisponível, usando mock para atualizar avaliação de coordenador ${id}`);
      const stored = localStorage.getItem('mockAvaliacoesCoordenador');
      if (stored) {
        const mockCoordenadores = JSON.parse(stored);
        if (mockCoordenadores[id]) {
          mockCoordenadores[id] = { ...mockCoordenadores[id], ...avaliacao };
          localStorage.setItem('mockAvaliacoesCoordenador', JSON.stringify(mockCoordenadores));
          return { success: true, message: 'Avaliação de coordenador atualizada com sucesso (mock)' };
        }
      }
      throw new Error(`Avaliação de coordenador ${id} não encontrada`);
    }
  },
};

export const avaliacoesUsuarios = {
  listarAvaliacoes: async () => {
    try {
      const response = await api.get('/avaliacoes');
      return response.data;
    } catch (err) {
      // Mock em caso de erro de conexão - retorna todas as avaliações combinadas
      console.warn('API indisponível, usando mock para listar todas as avaliações do usuário');
      
      const todasAvaliacoes = [];

      // Adicionar avaliações de professor
      const storedProfessor = localStorage.getItem('mockAvaliacoes');
      if (storedProfessor) {
        const avaliacoesProfessor = Object.values(JSON.parse(storedProfessor));
        todasAvaliacoes.push(...avaliacoesProfessor);
      }

      // Adicionar avaliações de disciplina
      const storedDisciplina = localStorage.getItem('mockAvaliacoesDisciplina');
      if (storedDisciplina) {
        const avaliacoesDisciplina = Object.values(JSON.parse(storedDisciplina));
        todasAvaliacoes.push(...avaliacoesDisciplina);
      }

      // Adicionar avaliações de coordenador
      const storedCoordenador = localStorage.getItem('mockAvaliacoesCoordenador');
      if (storedCoordenador) {
        const avaliacoesCoordenador = Object.values(JSON.parse(storedCoordenador));
        todasAvaliacoes.push(...avaliacoesCoordenador);
      }

      return todasAvaliacoes;
    }
  },
};