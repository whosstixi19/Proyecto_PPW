package dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import modelo.Ausencia;

public class AusenciaDAO implements CrudDAO<Ausencia> {
    private final Map<String, Ausencia> storage = new ConcurrentHashMap<>();

    @Override
    public Ausencia create(String id, Ausencia entity) {
        String key = resolveKey(id, entity.getId());
        entity.setId(key);
        storage.put(key, entity);
        return entity;
    }

    @Override
    public Optional<Ausencia> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<Ausencia> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public Ausencia update(String id, Ausencia entity) {
        String key = resolveKey(id, entity.getId());
        if (!storage.containsKey(key)) {
            throw new IllegalArgumentException("Ausencia no encontrada para el id " + key);
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
