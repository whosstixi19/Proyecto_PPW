package dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import modelo.Programador;

public class ProgramadorDAO implements CrudDAO<Programador> {
    private final Map<String, Programador> storage = new ConcurrentHashMap<>();

    @Override
    public Programador create(String id, Programador entity) {
        String key = resolveKey(id, entity.getUid());
        entity.setUid(key);
        storage.put(key, entity);
        return entity;
    }

    @Override
    public Optional<Programador> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<Programador> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public Programador update(String id, Programador entity) {
        String key = resolveKey(id, entity.getUid());
        if (!storage.containsKey(key)) {
            throw new IllegalArgumentException("Programador no encontrado para el id " + key);
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
