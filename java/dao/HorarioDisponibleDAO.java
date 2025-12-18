package dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import modelo.HorarioDisponible;

public class HorarioDisponibleDAO implements CrudDAO<HorarioDisponible> {
    private final Map<String, HorarioDisponible> storage = new ConcurrentHashMap<>();

    @Override
    public HorarioDisponible create(String id, HorarioDisponible entity) {
        String key = resolveKey(id);
        storage.put(key, entity);
        return entity;
    }

    @Override
    public Optional<HorarioDisponible> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<HorarioDisponible> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public HorarioDisponible update(String id, HorarioDisponible entity) {
        String key = resolveKey(id);
        if (!storage.containsKey(key)) {
            throw new IllegalArgumentException("HorarioDisponible no encontrado para el id " + key);
        }
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

    private String resolveKey(String providedId) {
        if (providedId != null && !providedId.isBlank()) {
            return providedId;
        }
        return UUID.randomUUID().toString();
    }
}
