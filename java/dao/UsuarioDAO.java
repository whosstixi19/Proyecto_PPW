package dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import modelo.Usuario;

public class UsuarioDAO implements CrudDAO<Usuario> {
    private final Map<String, Usuario> storage = new ConcurrentHashMap<>();

    @Override
    public Usuario create(String id, Usuario entity) {
        String key = resolveKey(id, entity.getUid());
        entity.setUid(key);
        storage.put(key, entity);
        return entity;
    }

    @Override
    public Optional<Usuario> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<Usuario> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public Usuario update(String id, Usuario entity) {
        String key = resolveKey(id, entity.getUid());
        if (!storage.containsKey(key)) {
            throw new IllegalArgumentException("Usuario no encontrado para el id " + key);
        }
        entity.setUid(key);
        storage.put(key, entity);
        return entity;
    }

    @Override
    public boolean delete(String id) {
        return storage.remove(id) != null;
    }

    @Override
    public void clear() {
        storage.clear();
    }

    private String resolveKey(String providedId, String entityId) {
        if (providedId != null && !providedId.isBlank()) {
            return providedId;
        }
        if (entityId != null && !entityId.isBlank()) {
            return entityId;
        }
        return UUID.randomUUID().toString();
    }
}
