package dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import modelo.Asesoria;

public class AsesoriaDAO implements CrudDAO<Asesoria> {
    private final Map<String, Asesoria> storage = new ConcurrentHashMap<>();

    @Override
    public Asesoria create(String id, Asesoria entity) {
        String key = resolveKey(id, entity.getId());
        entity.setId(key);
        storage.put(key, entity);
        return entity;
    }

    @Override
    public Optional<Asesoria> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<Asesoria> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public Asesoria update(String id, Asesoria entity) {
        String key = resolveKey(id, entity.getId());
        if (!storage.containsKey(key)) {
            throw new IllegalArgumentException("Asesoria no encontrada para el id " + key);
        }
        entity.setId(key);
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
