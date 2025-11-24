package com.gastos.control_gastos_personales.service;

import com.gastos.control_gastos_personales.dto.CategoriaDTO;
import com.gastos.control_gastos_personales.model.Categoria;
import com.gastos.control_gastos_personales.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaService {
    
    private final CategoriaRepository categoriaRepository;
    
    public CategoriaDTO crearCategoria(String idUsuario, CategoriaDTO categoriaDTO) {
        Categoria categoria = new Categoria();
        categoria.setNombre(categoriaDTO.getNombre());
        categoria.setDescripcion(categoriaDTO.getDescripcion());
        categoria.setIdUsuario(idUsuario);
        
        Categoria categoriaGuardada = categoriaRepository.save(categoria);
        
        return convertirADTO(categoriaGuardada);
    }
    
    public List<CategoriaDTO> obtenerCategoriasPorUsuario(String idUsuario) {
        return categoriaRepository.findByIdUsuario(idUsuario)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    public CategoriaDTO obtenerCategoriaPorId(String id, String idUsuario) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        if (!categoria.getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("No tienes permiso para acceder a esta categoría");
        }
        
        return convertirADTO(categoria);
    }
    
    public CategoriaDTO editarCategoria(String id, String idUsuario, CategoriaDTO categoriaDTO) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        if (!categoria.getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("No tienes permiso para editar esta categoría");
        }
        
        categoria.setNombre(categoriaDTO.getNombre());
        categoria.setDescripcion(categoriaDTO.getDescripcion());
        
        Categoria categoriaActualizada = categoriaRepository.save(categoria);
        
        return convertirADTO(categoriaActualizada);
    }
    
    public void eliminarCategoria(String id, String idUsuario) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        if (!categoria.getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("No tienes permiso para eliminar esta categoría");
        }
        
        categoriaRepository.delete(categoria);
    }
    
    private CategoriaDTO convertirADTO(Categoria categoria) {
        CategoriaDTO dto = new CategoriaDTO();
        dto.setId(categoria.getId());
        dto.setNombre(categoria.getNombre());
        dto.setDescripcion(categoria.getDescripcion());
        return dto;
    }
}


